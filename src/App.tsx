import type { FormEvent } from 'react'
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
  options?: string[]
}

type LeadFormConfig = {
  id: string
  eyebrow: string
  title: string
  description: string
  subject: string
  submitLabel: string
  fields: LeadField[]
}

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

const quickStats = [
  { value: '7+', label: 'Delhi NCR markets' },
  { value: '3', label: 'lead categories' },
  { value: 'WhatsApp', label: 'first response' },
]

const featureCards = [
  {
    title: 'Verified Leads',
    text: 'We focus on serious tenants, buyers, sellers and property owners across Delhi NCR.',
  },
  {
    title: 'Fast Response',
    text: 'Our team connects with you quickly through phone or WhatsApp.',
  },
  {
    title: 'Delhi NCR Coverage',
    text: 'Delhi, Gurgaon, Noida, Greater Noida, Ghaziabad, Faridabad and nearby areas.',
  },
]

const leadForms: LeadFormConfig[] = [
  {
    id: 'rent',
    eyebrow: 'For tenants',
    title: 'Rental Requirement',
    description: 'Share your preferred location, property type and monthly budget.',
    subject: 'Rental Requirement',
    submitLabel: 'Submit Rental Requirement',
    fields: [
      {
        name: 'rent_name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
      },
      {
        name: 'rent_phone',
        label: 'Phone Number',
        placeholder: 'Enter your mobile number',
        type: 'tel',
        required: true,
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
      },
      {
        name: 'rent_details',
        label: 'Requirement Details',
        placeholder: 'Move-in date, family/company use, furnishing preference',
        as: 'textarea',
        rows: 4,
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
    fields: [
      {
        name: 'owner_name',
        label: 'Owner Name',
        placeholder: 'Enter owner name',
        required: true,
      },
      {
        name: 'owner_phone',
        label: 'Phone Number',
        placeholder: 'Enter your mobile number',
        type: 'tel',
        required: true,
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
      },
      {
        name: 'property_details',
        label: 'Property Details',
        placeholder: 'Area, furnishing, floor, possession and any key details',
        as: 'textarea',
        rows: 4,
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
    fields: [
      {
        name: 'buy_name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
      },
      {
        name: 'buy_phone',
        label: 'Phone Number',
        placeholder: 'Enter your mobile number',
        type: 'tel',
        required: true,
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
      },
      {
        name: 'buy_details',
        label: 'Requirement Details',
        placeholder: 'Tell us your requirement',
        as: 'textarea',
        rows: 4,
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

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

const formatFieldName = (name: string) =>
  name
    .replace(/^(rent|buy|owner)_/, '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

function submitToWhatsApp(event: FormEvent<HTMLFormElement>, subject: string) {
  event.preventDefault()

  const form = event.currentTarget
  const fields = Array.from(new FormData(form).entries())
    .map(([name, value]) => [formatFieldName(name), String(value).trim()])
    .filter(([, value]) => value.length > 0)

  const message = [
    `New ${subject}`,
    'Source: 99 Acres lead page',
    '',
    ...fields.map(([name, value]) => `${name}: ${value}`),
  ].join('\n')

  window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
  form.reset()
}

function LeadForm({ config }: { config: LeadFormConfig }) {
  return (
    <article
      className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-6"
      id={config.id}
    >
      <div className="mb-6 border-b border-slate-100 pb-5">
        <p className="mb-2 text-xs font-extrabold uppercase text-emerald-700">
          {config.eyebrow}
        </p>
        <h3 className="text-2xl font-black leading-tight text-slate-950">
          {config.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{config.description}</p>
      </div>

      <form className="grid gap-4" onSubmit={(event) => submitToWhatsApp(event, config.subject)}>
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
              />
            </label>
          )
        })}

        <button className={`${primaryButtonClass} mt-2 w-full`} type="submit">
          {config.submitLabel}
        </button>
      </form>
    </article>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-[#f4f7f2] font-sans text-slate-950 antialiased">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/90 px-4 py-3 shadow-sm shadow-slate-950/5 backdrop-blur-xl sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a
            className="flex min-w-0 items-center gap-3"
            href="#top"
            aria-label="Delhi NCR Property Leads home"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-950 text-sm font-black text-white">
              99
            </span>
            <strong className="max-w-44 text-sm font-black leading-tight text-slate-950 sm:max-w-none sm:text-base">
              Delhi NCR Property Leads
            </strong>
          </a>

          <nav className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 text-sm font-bold text-slate-700 lg:flex">
            <a className="rounded-lg px-4 py-2 hover:bg-white hover:text-emerald-800" href="#rent">
              Rent
            </a>
            <a
              className="rounded-lg px-4 py-2 hover:bg-white hover:text-emerald-800"
              href="#owner"
            >
              Sell / Rent Out
            </a>
            <a className="rounded-lg px-4 py-2 hover:bg-white hover:text-emerald-800" href="#buy">
              Buy
            </a>
            <a className="rounded-lg px-4 py-2 hover:bg-white hover:text-emerald-800" href="#why">
              Why Us
            </a>
          </nav>

          <a
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-emerald-800 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-950 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            href={whatsappLink('Hello, I want to discuss property leads in Delhi NCR.')}
            target="_blank"
            rel="noreferrer"
          >
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
              <h1 className="text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
                Delhi NCR Property Leads
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Capture rental, selling and buying requirements from serious
                property prospects across Delhi, Gurgaon, Noida, Ghaziabad,
                Faridabad and nearby areas.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className={primaryButtonClass} href="#rent">
                  Get Started
                </a>
                <a
                  className={secondaryButtonClass}
                  href={whatsappLink('Hello, I want to submit a property requirement.')}
                  target="_blank"
                  rel="noreferrer"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>

            <aside className="rounded-lg border border-white/20 bg-white/10 p-5 text-white shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-6">
              <p className="text-sm font-extrabold text-amber-300">Lead desk</p>
              <h2 className="mt-2 text-2xl font-black leading-tight">
                Submit once. Follow up on WhatsApp.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Each form opens a clean lead message with the prospect details,
                ready for your team to contact.
              </p>

              <dl className="mt-6 grid gap-3">
                {quickStats.map((stat) => (
                  <div
                    className="rounded-lg border border-white/15 bg-white/10 p-4"
                    key={stat.label}
                  >
                    <dt className="text-2xl font-black">{stat.value}</dt>
                    <dd className="mt-1 text-sm text-white/70">{stat.label}</dd>
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
              <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Rent, sell, rent out or buy property in one place.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Visitors can submit the right requirement quickly, and every
              submission opens directly in WhatsApp with clean lead details for
              follow-up.
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
                className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl"
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
                className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl"
                id="why-title"
              >
                A faster way to collect Delhi NCR property enquiries.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featureCards.map((feature, index) => (
                <article
                  className="rounded-lg border border-slate-200 bg-[#f9faf7] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5"
                  key={feature.title}
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-emerald-800 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-black text-slate-950">
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
          aria-labelledby="coverage-title"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-extrabold uppercase text-emerald-700">
                Coverage
              </p>
              <h2
                className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl"
                id="coverage-title"
              >
                Active across Delhi NCR
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {delhiNcrLocations.slice(0, -1).map((location) => (
                <span
                  className="rounded-full border border-emerald-900/10 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 shadow-sm"
                  key={location}
                >
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
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                Start Generating Property Leads Today
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-white/75">
                Submit your requirement and our team will contact you shortly.
              </p>
            </div>
            <a className={`${primaryButtonClass} w-full sm:w-auto`} href="#rent">
              Get Started
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
