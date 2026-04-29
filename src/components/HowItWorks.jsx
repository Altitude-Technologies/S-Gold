import { FaWalking, FaMicroscope, FaCalculator, FaWallet } from 'react-icons/fa'

const steps = [
  {
    icon: <FaWalking />,
    title: 'Walk In with Your Gold',
    text: 'No appointment required (optional booking available).',
  },
  {
    icon: <FaMicroscope />,
    title: 'Purity Testing — Live',
    text: 'We test your gold in front of you using advanced XRF machines.',
  },
  {
    icon: <FaCalculator />,
    title: 'Weight & Rate Display',
    text: 'See exact weight, today’s gold rate, and the final value calculation.',
  },
  {
    icon: <FaWallet />,
    title: 'Instant Payment',
    text: 'Accept the offer and receive payment immediately — Cash / UPI / Bank.',
  },
]

export default function HowItWorks() {
  return (
    <section id="process" className="section">
      <div className="container">
        <div className="section__head" data-aos="fade-up">
          <span className="kicker">How It Works</span>
          <h2 className="section__title">
            A Process Designed for <span className="text-gold">Clarity</span>
          </h2>
          <p className="section__lead">
            We keep it simple — because transparency builds confidence. The
            entire process takes less than 15 minutes.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline__line" />
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`tstep ${i % 2 === 0 ? 'tstep--left' : 'tstep--right'}`}
              data-aos={i % 2 === 0 ? 'fade-right' : 'fade-left'}
              data-aos-delay={i * 100}
            >
              <div className="tstep__node">
                <span className="tstep__num">{i + 1}</span>
                <span className="tstep__icon">{s.icon}</span>
              </div>
              <div className="tstep__card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="banner" data-aos="zoom-in">
          <span className="banner__pulse" />
          Entire process completed in <strong>10–15 minutes</strong>
        </div>
      </div>
    </section>
  )
}
