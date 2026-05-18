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
    <article className="lead-card" id={config.id}>
      <div className="lead-card__header">
        <p>{config.eyebrow}</p>
        <h3>{config.title}</h3>
        <span>{config.description}</span>
      </div>

      <form onSubmit={(event) => submitToWhatsApp(event, config.subject)}>
        {config.fields.map((field) => {
          if (field.as === 'textarea') {
            return (
              <label key={field.name} className="field field--wide">
                <span>{field.label}</span>
                <textarea
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
              <label key={field.name} className="field">
                <span>{field.label}</span>
                <select name={field.name} defaultValue="" required={field.required}>
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
            <label key={field.name} className="field">
              <span>{field.label}</span>
              <input
                type={field.type ?? 'text'}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
              />
            </label>
          )
        })}

        <button type="submit">{config.submitLabel}</button>
      </form>
    </article>
  )
}

function App() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Delhi NCR Property Leads home">
          <span>99</span>
          <strong>Delhi NCR Property Leads</strong>
        </a>

        <nav aria-label="Primary navigation">
          <a href="#rent">Rent</a>
          <a href="#owner">Sell / Rent Out</a>
          <a href="#buy">Buy</a>
          <a href="#why">Why Us</a>
        </nav>

        <a
          className="header-action"
          href={whatsappLink('Hello, I want to discuss property leads in Delhi NCR.')}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <img
            className="hero__image"
            src={propertyHero}
            alt="Modern residential buildings in Delhi NCR"
          />
          <div className="hero__overlay" />

          <div className="hero__content">
            <p className="eyebrow">Property leads for Delhi NCR</p>
            <h1>Delhi NCR Property Leads</h1>
            <p>
              Capture rental, selling and buying requirements from serious
              property prospects across Delhi, Gurgaon, Noida, Ghaziabad,
              Faridabad and nearby areas.
            </p>

            <div className="hero__actions">
              <a className="button button--primary" href="#rent">
                Get Started
              </a>
              <a
                className="button button--secondary"
                href={whatsappLink('Hello, I want to submit a property requirement.')}
                target="_blank"
                rel="noreferrer"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </div>

            <dl className="hero__stats">
              {quickStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="intro-section" aria-label="Lead categories">
          <div>
            <p className="section-kicker">Lead capture</p>
            <h2>Rent, sell, rent out or buy property in one place.</h2>
          </div>
          <p>
            Visitors can submit the right requirement quickly, and every
            submission opens directly in WhatsApp with clean lead details for
            follow-up.
          </p>
        </section>

        <section className="forms-section" aria-labelledby="forms-title">
          <div className="section-heading">
            <p className="section-kicker">Submit details</p>
            <h2 id="forms-title">Choose the property lead you need</h2>
          </div>

          <div className="form-grid">
            {leadForms.map((form) => (
              <LeadForm key={form.id} config={form} />
            ))}
          </div>
        </section>

        <section className="why-section" id="why" aria-labelledby="why-title">
          <div className="section-heading">
            <p className="section-kicker">Why choose us?</p>
            <h2 id="why-title">A faster way to collect Delhi NCR property enquiries.</h2>
          </div>

          <div className="feature-grid">
            {featureCards.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="coverage-section" aria-labelledby="coverage-title">
          <div>
            <p className="section-kicker">Coverage</p>
            <h2 id="coverage-title">Active across Delhi NCR</h2>
          </div>

          <div className="coverage-list">
            {delhiNcrLocations.slice(0, -1).map((location) => (
              <span key={location}>{location}</span>
            ))}
          </div>
        </section>

        <section className="cta">
          <div>
            <p className="section-kicker">Start today</p>
            <h2>Start Generating Property Leads Today</h2>
            <p>Submit your requirement and our team will contact you shortly.</p>
          </div>
          <a className="button button--primary" href="#rent">
            Get Started
          </a>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Delhi NCR Property Leads. All rights reserved.</p>
        <a href={`tel:+${WHATSAPP_NUMBER}`}>{WHATSAPP_DISPLAY}</a>
      </footer>
    </>
  )
}

export default App
