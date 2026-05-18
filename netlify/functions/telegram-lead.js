const TELEGRAM_API = 'https://api.telegram.org'
const MAX_BODY_LENGTH = 6000
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 8

const leadSchemas = {
  'Rental Requirement': {
    required: ['rent_name', 'rent_phone', 'rent_location', 'rent_property_type', 'rent_budget'],
    allowed: [
      'rent_name',
      'rent_phone',
      'rent_location',
      'rent_property_type',
      'rent_budget',
      'rent_details',
    ],
  },
  'Owner Property Lead': {
    required: [
      'owner_name',
      'owner_phone',
      'property_location',
      'owner_property_type',
      'listing_type',
      'expected_price',
    ],
    allowed: [
      'owner_name',
      'owner_phone',
      'property_location',
      'owner_property_type',
      'listing_type',
      'expected_price',
      'property_details',
    ],
  },
  'Buying Requirement': {
    required: ['buy_name', 'buy_phone', 'buy_location', 'buy_property_type', 'buy_budget'],
    allowed: [
      'buy_name',
      'buy_phone',
      'buy_location',
      'buy_property_type',
      'buy_budget',
      'buy_details',
    ],
  },
}

const allowedFieldValues = {
  rent_location: [
    'Delhi',
    'Gurgaon',
    'Noida',
    'Greater Noida',
    'Ghaziabad',
    'Faridabad',
    'Other Delhi NCR',
  ],
  property_location: [
    'Delhi',
    'Gurgaon',
    'Noida',
    'Greater Noida',
    'Ghaziabad',
    'Faridabad',
    'Other Delhi NCR',
  ],
  buy_location: [
    'Delhi',
    'Gurgaon',
    'Noida',
    'Greater Noida',
    'Ghaziabad',
    'Faridabad',
    'Other Delhi NCR',
  ],
  rent_property_type: ['Flat / Apartment', 'Builder Floor', 'Villa', 'Plot', 'Commercial'],
  owner_property_type: ['Flat / Apartment', 'Builder Floor', 'Villa', 'Plot', 'Commercial'],
  buy_property_type: ['Flat / Apartment', 'Builder Floor', 'Villa', 'Plot', 'Commercial'],
  listing_type: ['Sell Property', 'Rent Out Property', 'Lease Commercial'],
}

const fieldMaxLength = {
  rent_name: 80,
  owner_name: 80,
  buy_name: 80,
  rent_phone: 15,
  owner_phone: 15,
  buy_phone: 15,
  rent_location: 40,
  property_location: 40,
  buy_location: 40,
  rent_property_type: 40,
  owner_property_type: 40,
  buy_property_type: 40,
  listing_type: 40,
  rent_budget: 40,
  expected_price: 40,
  buy_budget: 40,
  rent_details: 600,
  property_details: 600,
  buy_details: 600,
}

const letterOnlyFields = ['rent_name', 'owner_name', 'buy_name']
const numberOnlyFields = ['rent_phone', 'owner_phone', 'buy_phone', 'rent_budget', 'expected_price', 'buy_budget']

const requestLog = new Map()

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
  },
  body: JSON.stringify(body),
})

const getClientKey = (event) =>
  event.headers?.['x-nf-client-connection-ip'] ||
  event.headers?.['client-ip'] ||
  event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
  'unknown'

const isRateLimited = (key) => {
  const now = Date.now()
  const recent = (requestLog.get(key) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(key, recent)
    return true
  }

  requestLog.set(key, [...recent, now])
  return false
}

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const sanitizeText = (value = '', maxLength = 120) =>
  String(value)
    .normalize('NFKC')
    .split('')
    .map((character) => {
      const code = character.charCodeAt(0)
      return code <= 31 || (code >= 127 && code <= 159) ? ' ' : character
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)

const formatLabel = (name) =>
  String(name)
    .replace(/^(rent|buy|owner)_/, '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const validatePayload = (payload) => {
  const subject = sanitizeText(payload?.subject, 80)
  const schema = leadSchemas[subject]

  if (!schema || typeof payload?.fields !== 'object' || Array.isArray(payload.fields)) {
    return { ok: false, error: 'Invalid lead payload' }
  }

  if (sanitizeText(payload.fields.company_website, 200)) {
    return { ok: false, error: 'Invalid lead payload' }
  }

  const fields = {}

  for (const fieldName of schema.allowed) {
    const value = sanitizeText(payload.fields[fieldName], fieldMaxLength[fieldName] || 120)

    if (!value) {
      continue
    }

    if (allowedFieldValues[fieldName] && !allowedFieldValues[fieldName].includes(value)) {
      return { ok: false, error: 'Invalid lead payload' }
    }

    fields[fieldName] = value
  }

  const missingRequiredField = schema.required.find((fieldName) => !fields[fieldName])

  if (missingRequiredField) {
    return { ok: false, error: 'Missing required lead details' }
  }

  for (const phoneField of ['rent_phone', 'owner_phone', 'buy_phone']) {
    if (fields[phoneField] && !/^[0-9]{7,15}$/.test(fields[phoneField])) {
      return { ok: false, error: 'Invalid phone number' }
    }
  }

  for (const letterField of letterOnlyFields) {
    if (fields[letterField] && !/^[A-Za-z ]{2,80}$/.test(fields[letterField])) {
      return { ok: false, error: 'Invalid name' }
    }
  }

  for (const numberField of numberOnlyFields) {
    if (fields[numberField] && !/^[0-9]+$/.test(fields[numberField])) {
      return { ok: false, error: 'Invalid numeric value' }
    }
  }

  return { ok: true, subject, fields }
}

const buildTelegramMessage = ({ subject, fields }) => {
  const title = sanitizeText(process.env.LEADS_NOTIFICATION_TITLE, 80) || 'Delhi NCR Property Leads'

  const details = Object.entries(fields)
    .map(([key, value]) => `<b>${escapeHtml(formatLabel(key))}:</b> ${escapeHtml(value)}`)
    .join('\n')

  return [
    `<b>${escapeHtml(title)}</b>`,
    `<b>New ${escapeHtml(subject)}</b>`,
    '',
    details,
  ].join('\n')
}

const sendToGoogleSheets = async ({ subject, fields }) => {
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

  if (!appsScriptUrl) {
    return { ok: true, skipped: true }
  }

  const sheetsResponse = await fetch(appsScriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, fields }),
  })

  if (!sheetsResponse.ok) {
    return { ok: false }
  }

  return { ok: true }
}

const sendToTelegram = async ({ botToken, chatId, lead }) =>
  fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(lead),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

const summarizeResponse = async (response) => {
  try {
    const body = await response.text()
    return { status: response.status, body: body.slice(0, 500) }
  } catch {
    return { status: response.status, body: '' }
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' })
  }

  if (!event.headers?.['content-type']?.toLowerCase().includes('application/json')) {
    return json(415, { ok: false, error: 'Unsupported content type' })
  }

  if (!event.body || event.body.length > MAX_BODY_LENGTH) {
    return json(413, { ok: false, error: 'Invalid request size' })
  }

  const clientKey = getClientKey(event)

  if (isRateLimited(clientKey)) {
    return json(429, { ok: false, error: 'Too many requests' })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    return json(500, {
      ok: false,
      error: 'Telegram environment variables are not configured',
    })
  }

  try {
    const payload = JSON.parse(event.body)
    const validation = validatePayload(payload)

    if (!validation.ok) {
      return json(400, { ok: false, error: validation.error })
    }

    const delivery = {
      sheets: 'skipped',
      telegram: 'skipped',
    }

    const sheetsResponse = await sendToGoogleSheets(validation)

    if (!sheetsResponse.ok) {
      delivery.sheets = 'failed'
      console.error('Google Sheets save failed')
    } else {
      delivery.sheets = sheetsResponse.skipped ? 'skipped' : 'sent'
    }

    const telegramResponse = await sendToTelegram({
      botToken,
      chatId,
      lead: validation,
    })

    if (!telegramResponse.ok) {
      delivery.telegram = 'failed'
      console.error('Telegram send failed', await summarizeResponse(telegramResponse))
    } else {
      delivery.telegram = 'sent'
    }

    if (delivery.sheets !== 'sent' && delivery.telegram !== 'sent') {
      return json(502, {
        ok: false,
        error: 'Lead delivery failed',
        delivery,
      })
    }

    return json(200, { ok: true, delivery })
  } catch {
    return json(400, { ok: false, error: 'Invalid request' })
  }
}
