import { useState } from 'react'
import { FaPlus, FaMinus, FaQuestionCircle } from 'react-icons/fa'

const faqs = [
  {
    q: 'Will my gold be damaged during testing?',
    a: 'No. We use non-destructive XRF technology — no scratching, no melting, no damage.',
  },
  {
    q: 'Do you deduct making charges?',
    a: 'No. We evaluate purely based on gold value — no hidden cuts or making-charge deductions.',
  },
  {
    q: 'Can I sell small quantities?',
    a: 'Yes. Even a small piece, single earring, or broken item is accepted.',
  },
  {
    q: 'Is the process safe?',
    a: 'Absolutely. Testing and payment happen in front of you, in a secure professional environment.',
  },
  {
    q: 'How long does the entire process take?',
    a: 'Usually 10–15 minutes from walk-in to instant payment.',
  },
  {
    q: 'How do I receive my payment?',
    a: 'You choose — Cash, UPI, or direct Bank Transfer. Funds are processed within minutes.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="section__head" data-aos="fade-up">
          <span className="kicker">
            <FaQuestionCircle /> FAQ
          </span>
          <h2 className="section__title">
            Everything You <span className="text-gold">Need to Know</span>
          </h2>
          <p className="section__lead">
            Smart, honest answers to the questions our customers ask most.
          </p>
        </div>

        <div className="faq">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.q}
                className="faq__wrap"
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <div
                  className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}
                >
                  <button
                    className="faq__q"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{f.q}</span>
                    <span className="faq__toggle">
                      {isOpen ? <FaMinus /> : <FaPlus />}
                    </span>
                  </button>
                  <div className="faq__a">
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
