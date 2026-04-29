import { FaEye, FaBalanceScale, FaHandshake } from 'react-icons/fa'
import { GiTrophyCup } from 'react-icons/gi'

const pillars = [
  {
    icon: <FaEye />,
    title: 'Open',
    text: 'Every step of the process is fully visible to you.',
  },
  {
    icon: <FaBalanceScale />,
    title: 'Accurate',
    text: 'Backed by modern XRF testing technology.',
  },
  {
    icon: <FaHandshake />,
    title: 'Fair',
    text: 'Pricing based on real-time market value.',
  },
]

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section__head" data-aos="fade-up">
          <span className="kicker">
            <GiTrophyCup /> About S Gold
          </span>
          <h2 className="section__title">
            Built on <span className="text-gold">Trust</span>. Driven by{' '}
            <span className="text-gold">Transparency</span>.
          </h2>
          <p className="section__lead">
            S Gold was founded with a simple belief —{' '}
            <em>“Selling gold should feel safe, fair, and respectful — not
            confusing or risky.”</em>{' '}
            In a market where customers often feel uncertain about pricing and
            deductions, we created a system that is open, accurate, and fair.
          </p>
        </div>

        <div className="pillars">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="pillar"
              data-aos="flip-left"
              data-aos-delay={i * 120}
            >
              <div className="pillar__icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>

        <div className="about__quote" data-aos="zoom-in-up">
          We are not just a gold-buying business —
          <br />
          <span className="text-gold">
            we are a trusted financial partner in your time of need.
          </span>
        </div>
      </div>
    </section>
  )
}
