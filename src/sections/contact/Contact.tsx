import { Mail, MapPin, Phone } from 'lucide-react'
import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { company } from '../../data/company'
import { ContactForm } from './ContactForm'

const contactDetails = [
  { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
  {
    icon: Phone,
    label: 'Phone',
    value: company.phone,
    href: `tel:${company.phone.replace(/[^\d+]/g, '')}`,
  },
  { icon: MapPin, label: 'Location', value: company.location, href: undefined },
]

/** Contact section: contact details beside the enquiry form. */
export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <Reveal>
            <div>
              <SectionHeading
                id="contact-title"
                eyebrow="Contact"
                title="Tell us about the system you need"
                description="Share a few details about your organisation and the problem you want solved. We will come back with questions and a suggested approach."
              />

              <dl className="mt-10 space-y-5">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="flex items-start gap-3.5">
                    <IconFrame icon={detail.icon} size="sm" />
                    <div>
                      <dt className="text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">
                        {detail.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-ink-900">
                        {detail.href ? (
                          <a
                            href={detail.href}
                            className="transition-colors duration-200 hover:text-accent-700"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          detail.value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl border border-ink-200 bg-ink-50"
              />
              <div className="relative">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}