import { useEffect, useRef, useState } from 'react'
import {
  FaChartLine,
  FaShieldAlt,
  FaEye,
  FaBolt,
  FaHandshake,
  FaStar,
} from 'react-icons/fa'

const stats = [
  { label: 'Customers Served', value: 100, suffix: '+' },
  { label: 'Avg. Process Time', value: 12, suffix: ' min' },
  { label: 'Purity Accuracy', value: 99.9, suffix: '%' },
  { label: 'Hidden Charges', value: 0, suffix: '' },
]

const PROMISES = [
  {
    icon: <FaShieldAlt />,
    accent: 'No-Melting Policy',
    title: 'Your Jewelry, Untouched',
    text:
      'We never melt, scratch, or damage your gold during testing. Every piece comes back exactly as it arrived.',
  },
  {
    icon: <FaEye />,
    accent: 'Full Transparency',
    title: 'Live, In-Front Testing',
    text:
      'XRF results, weight, and value all displayed openly on our screen — nothing happens behind the counter.',
  },
  {
    icon: <FaBolt />,
    accent: 'Instant Settlement',
    title: 'Same-Minute Payment',
    text:
      'Cash, UPI, or direct bank transfer — your choice, settled in minutes. Walk in. Walk out paid.',
  },
  {
    icon: <FaHandshake />,
    accent: '100% Honest Pricing',
    title: 'Zero Hidden Cuts',
    text:
      'No making-charge deductions. No “processing fees.” What we quote is what you receive.',
  },
]

function Counter({ to, suffix = '' }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let raf
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        const start = performance.now()
        const duration = 1500
        const animate = (t) => {
          const p = Math.min((t - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setN(eased * to)
          if (p < 1) raf = requestAnimationFrame(animate)
        }
        raf = requestAnimationFrame(animate)
        obs.disconnect()
      },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to])

  const display =
    to % 1 !== 0 ? n.toFixed(1) : Math.round(n).toLocaleString('en-IN')

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

const ROTATE_MS = 5000

function PromiseDeck() {
  const [active, setActive] = useState(0)
  const len = PROMISES.length

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % len)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [len])

  return (
    <div className="deck">
      <div className="deck__sheen" />
      <div className="deck__head">
        <span className="deck__pill">
          <FaStar /> The S Gold Promise
        </span>
        <h3>
          Built on Trust. <span className="text-gold">Proven Daily.</span>
        </h3>
      </div>

      <div className="deck__stack">
        {PROMISES.map((p, i) => {
          const offset = (i - active + len) % len
          return (
            <article
              key={i}
              className="deck__card"
              style={{ '--off': offset, zIndex: len - offset }}
              aria-hidden={offset !== 0}
            >
              <div className="deck__icon">{p.icon}</div>
              <small className="deck__accent">{p.accent}</small>
              <h4>{p.title}</h4>
              <p>{p.text}</p>
              {offset === 0 && (
                <div className="deck__progress" key={active}>
                  <span />
                </div>
              )}
            </article>
          )
        })}
      </div>

      <div className="deck__dots">
        {PROMISES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`deck__dot ${i === active ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Show promise ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function LiveValue() {
  return (
    <section id="value" className="section value">
      <div className="container value__inner">
        <div className="value__copy" data-aos="fade-right">
          <span className="kicker">
            <FaChartLine /> Know Your Value
          </span>
          <h2 className="section__title">
            How Your Gold Value is{' '}
            <span className="text-gold">Calculated</span>
          </h2>
          <p>
            Your gold value depends on three transparent factors. We show every
            number openly — no hidden cuts, no surprises.
          </p>

          <ul className="formula">
            <li data-aos="fade-up" data-aos-delay="100">
              <span>01</span>
              <div>
                <h4>Current Market Rate</h4>
                <p>Live, today’s rate — refreshed throughout the day.</p>
              </div>
            </li>
            <li data-aos="fade-up" data-aos-delay="200">
              <span>02</span>
              <div>
                <h4>Purity (Karat)</h4>
                <p>Measured on the spot via XRF — no melting required.</p>
              </div>
            </li>
            <li data-aos="fade-up" data-aos-delay="300">
              <span>03</span>
              <div>
                <h4>Net Weight</h4>
                <p>Stones &amp; non-gold parts removed from the calculation.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="value__visual" data-aos="zoom-in" data-aos-delay="150">
          <PromiseDeck />

          <div className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <div className="stat__num">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
