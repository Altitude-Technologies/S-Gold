import { FaFacebook, FaInstagram, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa'
import logo from '../assets/logo.png'

const cols = [
  {
    title: 'Quick Links',
    items: [
      { href: '#home', label: 'Home' },
      { href: '#about', label: 'About' },
      { href: '#services', label: 'Services' },
      { href: '#process', label: 'How It Works' },
    ],
  },
  {
    title: 'Company',
    items: [
      { href: '#why', label: 'Why S Gold' },
      { href: '#testimonials', label: 'Reviews' },
      { href: '#faq', label: 'FAQ' },
      { href: '#contact', label: 'Contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#home" className="brand brand--lg">
            <img src={logo} alt="S Gold" className="brand__logo" />
          </a>
          <p>
            Honest gold buying. Live market rates. Instant payment. Built on
            transparency, one transaction at a time.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/sgoldtnj/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a href="#" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="tel:+917358453393" aria-label="Call">
              <FaPhoneAlt />
            </a>
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title} className="footer__col">
            <h4>{c.title}</h4>
            <ul>
              {c.items.map((it) => (
                <li key={it.href}>
                  <a href={it.href}>{it.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer__col">
          <h4>Contact</h4>
          <p className="footer__contact">
            Balaji Nagar, Darling Showroom Opp.,<br />M. C. Road, Thanjavur - 613004
          </p>
          <p className="footer__contact">
            <a href="tel:+917358453393">+91 73584 53393</a>
          </p>
          <p className="footer__contact">
            <a href="mailto:sgoldtnj@gmail.com">sgoldtnj@gmail.com</a>
          </p>
          <p className="footer__contact">Mon – Sat · 10 AM – 8 PM</p>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} S Gold. All rights reserved.</span>
        <span className="footer__credit">
          <span className="footer__heart" aria-hidden="true">❤️</span>
          &nbsp;Crafted with Innovation by{' '}
          <strong>Altitude Technologies</strong>
        </span>
      </div>
    </footer>
  )
}
