import { Mail, MapPin, Phone } from 'lucide-react'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import { buildCopyright, company } from '../../data/company'
import { primaryNavigation } from '../../data/navigation'
import { services } from '../../data/services'

const contactLinks = {
  email: `mailto:${company.email}`,
  phone: `tel:${company.phone.replace(/[^\d+]/g, '')}`,
}

/** Site footer: brand summary, navigation, services, contact details and copyright. */
export function Footer() {
  return (
    <footer data-tone="dark" className="bg-ink-950 text-ink-400">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo tone="dark" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{company.description}</p>

            {company.social.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-5">
                {company.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm font-medium text-ink-300 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-white uppercase">
              Navigate
            </h2>
            <ul className="mt-5 space-y-2">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block py-1 text-sm transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-white uppercase">
              Services
            </h2>
            <ul className="mt-5 space-y-2">
              {services.map((service) => (
                <li key={service.title}>
                  <a
                    href="#services"
                    className="block py-1 text-sm transition-colors duration-200 hover:text-white"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold tracking-[0.16em] text-white uppercase">
              Contact
            </h2>
            <ul className="mt-5 space-y-2 text-sm">
              <li>
                <a
                  href={contactLinks.email}
                  className="inline-flex items-center gap-2 py-1 transition-colors duration-200 hover:text-white"
                >
                  <Mail className="size-4 text-ink-400" aria-hidden="true" />
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={contactLinks.phone}
                  className="inline-flex items-center gap-2 py-1 transition-colors duration-200 hover:text-white"
                >
                  <Phone className="size-4 text-ink-400" aria-hidden="true" />
                  {company.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-ink-400" aria-hidden="true" />
                {company.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{buildCopyright()}</p>
          <p>Built with React, TypeScript and Tailwind CSS.</p>
        </div>
      </Container>
    </footer>
  )
}