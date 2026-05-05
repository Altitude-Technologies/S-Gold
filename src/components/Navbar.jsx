import { useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import logo from '../assets/logo.png'

const links = [
  { href: '#home', label: 'Home' },
  // { href: '#about', label: 'About' },
  // { href: '#services', label: 'Services' },
  // { href: '#process', label: 'How It Works' },
  // { href: '#why', label: 'Why Us' },
  // { href: '#faq', label: 'FAQ' },
  { href: '#/gold', label: 'Gold' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#home" className="brand" onClick={close}>
          <img src={logo} alt="S Gold" className="brand__logo" />
        </a>

        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={close}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="nav__cta" onClick={close}>
                Get My Gold Value
              </a>
            </li>
          </ul>
        </nav>

        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  )
}
