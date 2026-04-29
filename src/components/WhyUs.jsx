import {
  FaEye,
  FaBalanceScale,
  FaSmile,
  FaMicroscope,
  FaMoneyBillWave,
  FaReceipt,
  FaHandshake,
} from 'react-icons/fa'
import { GiTrophyCup, GiGoldBar } from 'react-icons/gi'

const reputation = [
  {
    icon: <FaEye />,
    title: 'Transparency in Every Step',
    text:
      'Every weighing, test, and calculation happens openly — right in front of you, on screen.',
  },
  {
    icon: <FaBalanceScale />,
    title: 'Fair, Real-Time Pricing',
    text:
      'Quotes always based on live market rates — never outdated estimates or guesswork.',
  },
  {
    icon: <FaSmile />,
    title: 'Professional & Respectful',
    text:
      'A clean, no-pressure environment built around your comfort and confidence.',
  },
]

const differentiators = [
  {
    icon: <FaMicroscope />,
    title: 'Advanced XRF Purity Testing',
    text: 'Scientific accuracy with zero damage to your gold.',
  },
  {
    icon: <FaBalanceScale />,
    title: 'Accurate Digital Weighing',
    text: 'Precision scales — net weight clearly displayed.',
  },
  {
    icon: <FaMoneyBillWave />,
    title: 'Instant Cash / UPI / Bank Transfer',
    text: 'Pick any payment method — settled in minutes.',
  },
  {
    icon: <FaReceipt />,
    title: 'No Hidden Deductions',
    text: 'No making charges, no processing fees, no surprises.',
  },
  {
    icon: <FaHandshake />,
    title: 'Friendly, No-Pressure Service',
    text: 'Take your time. Decide when you’re comfortable.',
  },
  {
    icon: <GiGoldBar />,
    title: 'Strict No-Melting Policy',
    text: 'Your jewelry stays intact — never melted, never reshaped.',
  },
]

export default function WhyUs() {
  return (
    <section id="why" className="section section--dark">
      <div className="container">
        <div className="section__head" data-aos="fade-up">
          <span className="kicker">
            <GiTrophyCup /> Why S Gold
          </span>
          <h2 className="section__title">
            Why <span className="text-gold">S Gold?</span>
          </h2>
          <p className="section__lead">
            Selling gold is not just a transaction — it’s a matter of trust.
            We’ve built our reputation on transparency, fair pricing, and
            professional service that ensures you feel{' '}
            <span className="text-gold">confident, informed, and valued</span>.
          </p>
        </div>

        <div className="reputation">
          {reputation.map((r, i) => (
            <div
              key={r.title}
              className="reputation__card"
              data-aos="flip-up"
              data-aos-delay={i * 120}
            >
              <div className="reputation__icon">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>

        <div className="why-sub" data-aos="fade-up">
          <span className="why-sub__divider" />
          <span className="why-sub__kicker">What Makes Us Different</span>
          <span className="why-sub__divider" />
        </div>

        <h3 className="why-sub__title" data-aos="fade-up">
          The <span className="text-gold">S Gold</span> Difference
        </h3>

        <div className="why-grid">
          {differentiators.map((p, i) => (
            <div
              key={p.title}
              className="why-card"
              data-aos="zoom-in-up"
              data-aos-delay={(i % 3) * 100}
            >
              <div className="why-card__icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <span className="why-card__corner" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
