import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const TELEGRAM_API = 'https://api.telegram.org'
const MAX_BODY_LENGTH = 6000
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 8

type LeadValidation =
  | { ok: true; subject: string; fields: Record<string, string> }
  | { ok: false; error: string }

const leadSchemas: Record<string, { required: string[]; allowed: string[] }> = {
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

const delhiNcrLocations = [
  'Delhi',
  'Gurgaon',
  'Noida',
  'Greater Noida',
  'Ghaziabad',
  'Faridabad',
  'Other Delhi NCR',
]

const propertyTypes = ['Flat / Apartment', 'Builder Floor', 'Villa', 'Plot', 'Commercial']

const allowedFieldValues: Record<string, string[]> = {
  rent_location: delhiNcrLocations,
  property_location: delhiNcrLocations,
  buy_location: delhiNcrLocations,
  rent_property_type: propertyTypes,
  owner_property_type: propertyTypes,
  buy_property_type: propertyTypes,
  listing_type: ['Sell Property', 'Rent Out Property', 'Lease Commercial'],
}

const fieldMaxLength: Record<string, number> = {
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

const requestLog = new Map<string, number[]>()

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

const formatLabel = (name: string) =>
  name
    .replace(/^(rent|buy|owner)_/, '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const isRateLimited = (key: string) => {
  const now = Date.now()
  const recent = (requestLog.get(key) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(key, recent)
    return true
  }

  requestLog.set(key, [...recent, now])
  return false
}

const validatePayload = (payload: {
  subject?: string
  fields?: Record<string, string>
}): LeadValidation => {
  const subject = sanitizeText(payload?.subject, 80)
  const schema = leadSchemas[subject]

  if (!schema || typeof payload?.fields !== 'object' || Array.isArray(payload.fields)) {
    return { ok: false, error: 'Invalid lead payload' }
  }

  if (sanitizeText(payload.fields.company_website, 200)) {
    return { ok: false, error: 'Invalid lead payload' }
  }

  const fields: Record<string, string> = {}

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

const buildTelegramMessage = ({ subject, fields }: Extract<LeadValidation, { ok: true }>, title: string) => {
  const details = Object.entries(fields)
    .map(([key, value]) => `<b>${escapeHtml(formatLabel(key))}:</b> ${escapeHtml(value)}`)
    .join('\n')

  return [
    `<b>${escapeHtml(sanitizeText(title, 80) || 'Delhi NCR Property Leads')}</b>`,
    `<b>New ${escapeHtml(subject)}</b>`,
    '',
    details,
  ].join('\n')
}

const sendToGoogleSheets = async (
  lead: Extract<LeadValidation, { ok: true }>,
  appsScriptUrl?: string,
) => {
  if (!appsScriptUrl) {
    return { ok: true, skipped: true }
  }

  const sheetsResponse = await fetch(appsScriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: lead.subject,
      fields: lead.fields,
    }),
  })

  if (!sheetsResponse.ok) {
    return { ok: false }
  }

  return { ok: true }
}

const sendToTelegram = async ({
  botToken,
  chatId,
  lead,
  title,
}: {
  botToken: string
  chatId: string
  lead: Extract<LeadValidation, { ok: true }>
  title: string
}) =>
  fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(lead, title),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

const readBody = async (request: NodeJS.ReadableStream) =>
  new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []

    request.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    request.on('error', reject)
  })

const telegramLeadDevPlugin = (env: Record<string, string>): Plugin => ({
  name: 'telegram-lead-dev-middleware',
  configureServer(server) {
    server.middlewares.use('/.netlify/functions/telegram-lead', async (request, response) => {
      response.setHeader('Content-Type', 'application/json')
      response.setHeader('X-Content-Type-Options', 'nosniff')

      if (request.method !== 'POST') {
        response.statusCode = 405
        response.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
        return
      }

      if (!request.headers['content-type']?.toLowerCase().includes('application/json')) {
        response.statusCode = 415
        response.end(JSON.stringify({ ok: false, error: 'Unsupported content type' }))
        return
      }

      const botToken = env.TELEGRAM_BOT_TOKEN
      const chatId = env.TELEGRAM_CHAT_ID

      if (!botToken || !chatId) {
        response.statusCode = 500
        response.end(
          JSON.stringify({
            ok: false,
            error: 'Telegram environment variables are not configured',
          }),
        )
        return
      }

      const clientKey = request.socket.remoteAddress || 'local'

      if (isRateLimited(clientKey)) {
        response.statusCode = 429
        response.end(JSON.stringify({ ok: false, error: 'Too many requests' }))
        return
      }

      try {
        const body = await readBody(request)

        if (!body || body.length > MAX_BODY_LENGTH) {
          response.statusCode = 413
          response.end(JSON.stringify({ ok: false, error: 'Invalid request size' }))
          return
        }

        const validation = validatePayload(JSON.parse(body))

        if (!validation.ok) {
          response.statusCode = 400
          response.end(JSON.stringify({ ok: false, error: validation.error }))
          return
        }

        const sheetsResponse = await sendToGoogleSheets(validation, env.GOOGLE_APPS_SCRIPT_URL)

        if (!sheetsResponse.ok) {
          response.statusCode = 502
          response.end(JSON.stringify({ ok: false, error: 'Google Sheets save failed' }))
          return
        }

        const telegramResponse = await sendToTelegram({
          botToken,
          chatId,
          lead: validation,
          title: env.LEADS_NOTIFICATION_TITLE || 'Delhi NCR Property Leads',
        })

        if (!telegramResponse.ok) {
          response.statusCode = 502
          response.end(JSON.stringify({ ok: false, error: 'Telegram send failed' }))
          return
        }

        response.statusCode = 200
        response.end(JSON.stringify({ ok: true }))
      } catch {
        response.statusCode = 400
        response.end(JSON.stringify({ ok: false, error: 'Invalid request' }))
      }
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), telegramLeadDevPlugin(env)],
  }
})
