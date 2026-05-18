import { useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react'
import propertyHero from './assets/property-hero.png'

const WHATSAPP_NUMBER = '918800771215'
const WHATSAPP_DISPLAY = '+91 88007 71215'

type LeadField = {
  name: string
  label: string
  placeholder: string
  type?: string
  required?: boolean
  as?: 'input' | 'select' | 'textarea'
  rows?: number
  maxLength?: number
  inputMode?: 'numeric' | 'tel' | 'text'
  pattern?: string
  autoComplete?: string
  inputKind?: 'letters' | 'numbers'
  options?: string[]
}

type LeadFormConfig = {
  id: string
  eyebrow: string
  title: string
  description: string
  subject: string
  submitLabel: string
  icon: IconName
  fields: LeadField[]
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

type IconName =
  | 'arrow'
  | 'building'
  | 'check'
  | 'home'
  | 'map'
  | 'phone'
  | 'shield'
  | 'spark'
  | 'timer'
  | 'whatsapp'

const propertyTypes = [
  'Flat / Apartment',
  'Builder Floor',
  'Villa',
  'Plot',
  'Commercial',
]

const delhiNcrLocations = [
  'Delhi',
  'Gurgaon',
  'Noida',
  'Greater Noida',
  'Ghaziabad',
  'Faridabad',
  'Other Delhi NCR',
]

const quickStats: { value: string; label: string; icon: IconName }[] = [
  { value: '7+', label: 'Delhi NCR markets', icon: 'map' },
  { value: '3', label: 'lead categories', icon: 'building' },
  { value: 'WhatsApp', label: 'first response', icon: 'whatsapp' },
]

const featureCards: { title: string; text: string; icon: IconName }[] = [
  {
    title: 'Verified Leads',
    text: 'We focus on serious tenants, buyers, sellers and property owners across Delhi NCR.',
    icon: 'shield',
  },
  {
    title: 'Fast Response',
    text: 'Our team connects with you quickly through phone or WhatsApp.',
    icon: 'timer',
  },
  {
    title: 'Delhi NCR Coverage',
    text: 'Delhi, Gurgaon, Noida, Greater Noida, Ghaziabad, Faridabad and nearby areas.',
    icon: 'map',
  },
]

const routeTargets: Record<string, string> = {
  '/': 'top',
  '/rent': 'rent',
  '/owner': 'owner',
  '/buy': 'buy',
  '/why': 'why',
  '/coverage': 'coverage',
}

const leadForms: LeadFormConfig[] = [
  {
    id: 'rent',
    eyebrow: 'For tenants',
    title: 'Rental Requirement',
    description: 'Share your preferred location, property type and monthly budget.',
    subject: 'Rental Requirement',
    submitLabel: 'Submit Rental Requirement',
    icon: 'home',
    fields: [
      {
        name: 'rent_name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        maxLength: 80,
        autoComplete: 'name',
        inputKind: 'letters',
      },
      {
        name: 'rent_phone',
        label: 'Phone Number',
        placeholder: 'Enter your mobile number',
        type: 'tel',
        required: true,
        maxLength: 15,
        inputMode: 'numeric',
        pattern: '[0-9]{7,15}',
        autoComplete: 'tel',
        inputKind: 'numbers',
      },
      {
        name: 'rent_location',
        label: 'Preferred Location',
        placeholder: 'Select location',
        as: 'select',
        options: delhiNcrLocations,
        required: true,
      },
      {
        name: 'rent_property_type',
        label: 'Property Type',
        placeholder: 'Select property type',
        as: 'select',
        options: propertyTypes,
        required: true,
      },
      {
        name: 'rent_budget',
        label: 'Monthly Budget',
        placeholder: 'Monthly rent budget',
        required: true,
        maxLength: 40,
        inputMode: 'numeric',
        pattern: '[0-9]{1,40}',
        inputKind: 'numbers',
      },
      {
        name: 'rent_details',
        label: 'Requirement Details',
        placeholder: 'Move-in date, family/company use, furnishing preference',
        as: 'textarea',
        rows: 4,
        maxLength: 600,
      },
    ],
  },
  {
    id: 'owner',
    eyebrow: 'For owners',
    title: 'Sell or Rent Out Property',
    description: 'List your property requirement and connect with active prospects.',
    subject: 'Owner Property Lead',
    submitLabel: 'Submit Property Details',
    icon: 'building',
    fields: [
      {
        name: 'owner_name',
        label: 'Owner Name',
        placeholder: 'Enter owner name',
        required: true,
        maxLength: 80,
        autoComplete: 'name',
        inputKind: 'letters',
      },
      {
        name: 'owner_phone',
        label: 'Phone Number',
        placeholder: 'Enter your mobile number',
        type: 'tel',
        required: true,
        maxLength: 15,
        inputMode: 'numeric',
        pattern: '[0-9]{7,15}',
        autoComplete: 'tel',
        inputKind: 'numbers',
      },
      {
        name: 'property_location',
        label: 'Property Location',
        placeholder: 'Select location',
        as: 'select',
        options: delhiNcrLocations,
        required: true,
      },
      {
        name: 'owner_property_type',
        label: 'Property Type',
        placeholder: 'Select property type',
        as: 'select',
        options: propertyTypes,
        required: true,
      },
      {
        name: 'listing_type',
        label: 'Listing Type',
        placeholder: 'Select listing type',
        as: 'select',
        options: ['Sell Property', 'Rent Out Property', 'Lease Commercial'],
        required: true,
      },
      {
        name: 'expected_price',
        label: 'Expected Price',
        placeholder: 'Expected rent or sale price',
        required: true,
        maxLength: 40,
        inputMode: 'numeric',
        pattern: '[0-9]{1,40}',
        inputKind: 'numbers',
      },
      {
        name: 'property_details',
        label: 'Property Details',
        placeholder: 'Area, furnishing, floor, possession and any key details',
        as: 'textarea',
        rows: 4,
        maxLength: 600,
      },
    ],
  },
  {
    id: 'buy',
    eyebrow: 'For buyers',
    title: 'Buying Requirement',
    description: 'Tell us what you want to buy and the team will shortlist options.',
    subject: 'Buying Requirement',
    submitLabel: 'Submit Buying Requirement',
    icon: 'check',
    fields: [
      {
        name: 'buy_name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        maxLength: 80,
        autoComplete: 'name',
        inputKind: 'letters',
      },
      {
        name: 'buy_phone',
        label: 'Phone Number',
        placeholder: 'Enter your mobile number',
        type: 'tel',
        required: true,
        maxLength: 15,
        inputMode: 'numeric',
        pattern: '[0-9]{7,15}',
        autoComplete: 'tel',
        inputKind: 'numbers',
      },
      {
        name: 'buy_location',
        label: 'Preferred Location',
        placeholder: 'Select location',
        as: 'select',
        options: delhiNcrLocations,
        required: true,
      },
      {
        name: 'buy_property_type',
        label: 'Property Type',
        placeholder: 'Select property type',
        as: 'select',
        options: propertyTypes,
        required: true,
      },
      {
        name: 'buy_budget',
        label: 'Buying Budget',
        placeholder: 'Buying budget',
        required: true,
        maxLength: 40,
        inputMode: 'numeric',
        pattern: '[0-9]{1,40}',
        inputKind: 'numbers',
      },
      {
        name: 'buy_details',
        label: 'Requirement Details',
        placeholder: 'Tell us your requirement',
        as: 'textarea',
        rows: 4,
        maxLength: 600,
      },
    ],
  },
]

const inputClass =
  'min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100'

const labelClass = 'grid gap-2 text-sm font-bold text-slate-800'

const primaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-900/10 transition hover:-translate-y-0.5 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-200'

const secondaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20'

function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    building: (
      <>
        <path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16" />
        <path d="M8 7h1m3 0h1M8 11h1m3 0h1M8 15h1m3 0h1M3 21h18" />
      </>
    ),
    check: (
      <>
        <path d="m20 6-11 11-5-5" />
        <path d="M21 12a9 9 0 1 1-4.7-7.9" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    map: (
      <>
        <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
        <path d="M9 3v15m6-12v15" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z" />
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
        <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
        <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" />
      </>
    ),
    timer: (
      <>
        <path d="M10 2h4" />
        <path d="M12 14V9" />
        <path d="M19 13a7 7 0 1 1-7-7 7 7 0 0 1 7 7Z" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M3 21 4.3 17A9 9 0 1 1 8 20.1L3 21Z" />
        <path d="M9.2 8.7c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.3 0 .5-.1.7l-.5.6c-.1.1-.2.3 0 .6.3.5.8 1.1 1.4 1.6.7.6 1.3.9 1.7 1 .2.1.5.1.6-.1l.7-.8c.2-.2.4-.2.7-.1l1.7.8c.3.1.4.3.4.5 0 .4-.2 1.4-.9 1.9-.7.5-1.7.5-2.8.2a9.9 9.9 0 0 1-4.7-3.1 9.5 9.5 0 0 1-2.1-3.7c-.2-.8.1-1.5.5-1.9.3-.4.6-.7 1-.8Z" />
      </>
    ),
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const whatsappLink = (message: string) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`

const sanitizeFieldInput = (value: string, inputKind?: LeadField['inputKind']) => {
  if (inputKind === 'letters') {
    return value.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' ')
  }

  if (inputKind === 'numbers') {
    return value.replace(/\D/g, '')
  }

  return value
}

const targetForPath = (path: string) => routeTargets[path] || 'top'

const scrollToRoute = (path: string) => {
  const target = document.getElementById(targetForPath(path))

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const navigateTo = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault()
  window.history.pushState({}, '', path)
  scrollToRoute(path)
}

const trackLeadEvent = () => {
  window.fbq?.('track', 'Lead')
}

function LeadForm({ config }: { config: LeadFormConfig }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submitToTelegram(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')

    const form = event.currentTarget
    const fields = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([name, value]) => [
        name,
        String(value).trim().replace(/\s+/g, ' '),
      ]),
    )

    try {
      const response = await fetch('/.netlify/functions/telegram-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: config.subject,
          fields,
        }),
      })

      if (!response.ok) {
        throw new Error('Lead submission failed')
      }

      setStatus('sent')
      trackLeadEvent()
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <article
      className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-6"
      id={config.id}
    >
      <div className="mb-6 border-b border-slate-100 pb-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-emerald-50 text-emerald-800 ring-1 ring-emerald-900/10">
            <Icon name={config.icon} />
          </span>
          <p className="text-xs font-extrabold uppercase text-emerald-700">
            {config.eyebrow}
          </p>
        </div>
        <h3 className="font-display text-2xl font-black leading-tight text-slate-950">
          {config.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{config.description}</p>
      </div>

      <form className="grid gap-4" onSubmit={submitToTelegram} autoComplete="off">
        <label className="hidden" aria-hidden="true">
          Company website
          <input
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />
        </label>

        {config.fields.map((field) => {
          if (field.as === 'textarea') {
            return (
              <label key={field.name} className={labelClass}>
                <span>{field.label}</span>
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  name={field.name}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 4}
                  required={field.required}
                  maxLength={field.maxLength}
                  autoComplete="off"
                />
              </label>
            )
          }

          if (field.as === 'select') {
            return (
              <label key={field.name} className={labelClass}>
                <span>{field.label}</span>
                <select
                  className={`${inputClass} cursor-pointer`}
                  name={field.name}
                  defaultValue=""
                  required={field.required}
                  autoComplete="off"
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            )
          }

          return (
            <label key={field.name} className={labelClass}>
              <span>{field.label}</span>
              <input
                className={inputClass}
                type={field.type ?? 'text'}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                maxLength={field.maxLength}
                inputMode={field.inputMode}
                pattern={field.pattern}
                autoComplete="off"
                onInput={(event) => {
                  event.currentTarget.value = sanitizeFieldInput(
                    event.currentTarget.value,
                    field.inputKind,
                  )
                }}
              />
            </label>
          )
        })}

        <button
          className={`${primaryButtonClass} mt-2 w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70`}
          type="submit"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending Lead...' : config.submitLabel}
          <Icon name="arrow" className="size-4" />
        </button>

        {status === 'sent' && (
          <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            Lead received. Our team will contact you shortly.
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            Could not send this lead. Please use the WhatsApp button or try again.
          </p>
        )}
      </form>
    </article>
  )
}

function App() {
  useEffect(() => {
    const handleRouteChange = () => scrollToRoute(window.location.pathname)

    window.setTimeout(handleRouteChange, 0)
    window.addEventListener('popstate', handleRouteChange)

    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return (
    <div className="min-h-screen bg-[#f4f7f2] font-sans text-slate-950 antialiased">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/90 px-4 py-3 shadow-sm shadow-slate-950/5 backdrop-blur-xl sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a
            className="flex min-w-0 items-center gap-3"
            href="/"
            onClick={navigateTo('/')}
            aria-label="Delhi NCR Property Leads home"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-950 text-white">
              <Icon name="building" className="size-5" />
            </span>
            <strong className="font-display max-w-44 text-sm font-black leading-tight text-slate-950 sm:max-w-none sm:text-base">
              Delhi NCR Property Leads
            </strong>
          </a>

          <nav className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 text-sm font-bold text-slate-700 lg:flex">
            <a
              className="rounded-lg px-4 py-2 hover:bg-white hover:text-emerald-800"
              href="/rent"
              onClick={navigateTo('/rent')}
            >
              Rent
            </a>
            <a
              className="rounded-lg px-4 py-2 hover:bg-white hover:text-emerald-800"
              href="/owner"
              onClick={navigateTo('/owner')}
            >
              Sell / Rent Out
            </a>
            <a
              className="rounded-lg px-4 py-2 hover:bg-white hover:text-emerald-800"
              href="/buy"
              onClick={navigateTo('/buy')}
            >
              Buy
            </a>
            <a
              className="rounded-lg px-4 py-2 hover:bg-white hover:text-emerald-800"
              href="/why"
              onClick={navigateTo('/why')}
            >
              Why Us
            </a>
          </nav>

          <a
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-950 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            href={whatsappLink('Hello, I want to discuss property leads in Delhi NCR.')}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" className="size-4" />
            WhatsApp
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate grid min-h-172.5 overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:min-h-190 lg:px-10 lg:py-28 xl:px-16">
          <img
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            src={propertyHero}
            alt="Modern residential buildings in Delhi NCR"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/95 via-emerald-950/75 to-slate-950/20" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-linear-to-t from-[#f4f7f2] to-transparent" />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.55fr)]">
            <div className="max-w-3xl text-white">
              <p className="mb-4 text-sm font-extrabold uppercase text-amber-300">
                Property leads for Delhi NCR
              </p>
              <h1 className="font-display text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
                Delhi NCR Property Leads
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Capture rental, selling and buying requirements from serious
                property prospects across Delhi, Gurgaon, Noida, Ghaziabad,
                Faridabad and nearby areas.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className={`${primaryButtonClass} gap-2`} href="/rent" onClick={navigateTo('/rent')}>
                  Get Started
                  <Icon name="arrow" className="size-4" />
                </a>
                <a
                  className={`${secondaryButtonClass} gap-2`}
                  href={whatsappLink('Hello, I want to submit a property requirement.')}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" className="size-4" />
                  {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>

            <aside className="rounded-lg border border-white/20 bg-white/10 p-5 text-white shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-6">
              <p className="text-sm font-extrabold text-amber-300">Lead desk</p>
              <h2 className="font-display mt-2 text-2xl font-black leading-tight">
                Submit once. Get logged instantly.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Each form validates the details, saves the lead, and alerts your
                team for quick follow-up.
              </p>

              <dl className="mt-6 grid gap-3">
                {quickStats.map((stat) => (
                  <div
                    className="flex items-center gap-4 rounded-lg border border-white/15 bg-white/10 p-4"
                    key={stat.label}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-amber-200">
                      <Icon name={stat.icon} className="size-5" />
                    </span>
                    <div>
                      <dt className="font-display text-2xl font-black">{stat.value}</dt>
                      <dd className="mt-1 text-sm text-white/70">{stat.label}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <section
          className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-20 xl:px-16"
          aria-label="Lead categories"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase text-amber-600">
                Lead capture
              </p>
              <h2 className="font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Rent, sell, rent out or buy property in one place.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Visitors can submit the right requirement quickly, and every
              submission is validated before it reaches your lead workflow.
            </p>
          </div>
        </section>

        <section
          className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24 xl:px-16"
          aria-labelledby="forms-title"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-sm font-extrabold uppercase text-emerald-700">
                Submit details
              </p>
              <h2
                className="font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl"
                id="forms-title"
              >
                Choose the property lead you need
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {leadForms.map((form) => (
                <LeadForm key={form.id} config={form} />
              ))}
            </div>
          </div>
        </section>

        <section
          className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24 xl:px-16"
          id="why"
          aria-labelledby="why-title"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-sm font-extrabold uppercase text-amber-600">
                Why choose us?
              </p>
              <h2
                className="font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl"
                id="why-title"
              >
                A faster way to collect Delhi NCR property enquiries.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featureCards.map((feature) => (
                <article
                  className="rounded-lg border border-slate-200 bg-[#f9faf7] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5"
                  key={feature.title}
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-emerald-800 text-white shadow-lg shadow-emerald-900/10">
                    <Icon name={feature.icon} className="size-5" />
                  </span>
                  <h3 className="font-display mt-5 text-xl font-black text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20 xl:px-16"
          id="coverage"
          aria-labelledby="coverage-title"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase text-emerald-700">
                Coverage
              </p>
              <h2
                className="font-display text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl"
                id="coverage-title"
              >
                Active across Delhi NCR
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {delhiNcrLocations.slice(0, -1).map((location) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 shadow-sm"
                  key={location}
                >
                  <Icon name="map" className="size-4 text-emerald-700" />
                  {location}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24 xl:px-16">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-lg bg-linear-to-br from-emerald-900 via-emerald-800 to-amber-900 p-6 text-white shadow-2xl shadow-emerald-950/20 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase text-amber-200">
                Start today
              </p>
              <h2 className="font-display text-3xl font-black leading-tight sm:text-4xl">
                Start Generating Property Leads Today
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-white/75">
                Submit your requirement and our team will contact you shortly.
              </p>
            </div>
            <a
              className={`${primaryButtonClass} w-full gap-2 sm:w-auto`}
              href="/rent"
              onClick={navigateTo('/rent')}
            >
              Get Started
              <Icon name="arrow" className="size-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10 xl:px-16">
        <p>&copy; 2026 Delhi NCR Property Leads. All rights reserved.</p>
        <a className="font-extrabold text-emerald-800" href={`tel:+${WHATSAPP_NUMBER}`}>
          {WHATSAPP_DISPLAY}
        </a>
      </footer>
    </div>
  )
}

export default App
