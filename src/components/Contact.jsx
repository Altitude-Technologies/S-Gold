import { useState } from 'react'
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
} from 'react-icons/fa'

const initial = {
  name: '',
  phone: '',
  email: '',
  type: '',
  weight: '',
  location: '',
  time: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [sent, setSent] = useState(false)

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm(initial)
    setTimeout(() => setSent(false), 4500)
  }

  return (
    <section id="contact" className="section section--dark">
      <div className="container">
        <div className="section__head" data-aos="fade-up">
          <span className="kicker">Contact</span>
          <h2 className="section__title">
            Get Your Gold <span className="text-gold">Valued Today</span>
          </h2>
          <p className="section__lead">
            Have questions or want to know how much your gold is worth? Fill
            out the form and our team will get back to you with the best
            possible assistance. <strong>Fast response. Transparent
            guidance. No obligation.</strong>
          </p>
        </div>

        <div className="contact">
          <aside className="contact__info" data-aos="fade-right">
            <h3>Visit Us Today</h3>
            <ul>
              <li>
                <FaMapMarkerAlt />
                <div>
                  <small>Address</small>
                  <span>
                    Balaji Nagar, Darling Showroom Opp.,<br />
                    M. C. Road, Thanjavur - 613004
                  </span>
                </div>
              </li>
              <li>
                <FaPhoneAlt />
                <div>
                  <small>Phone</small>
                  <span>
                    <a href="tel:+917358453393">+91 73584 53393</a>
                  </span>
                </div>
              </li>
              <li>
                <FaEnvelope />
                <div>
                  <small>Email</small>
                  <span>
                    <a href="mailto:sgoldtnj@gmail.com">sgoldtnj@gmail.com</a>
                  </span>
                </div>
              </li>
              <li>
                <FaClock />
                <div>
                  <small>Working Hours</small>
                  <span>Mon – Sat · 10:00 AM – 8:00 PM</span>
                  <span className="muted">Sunday · Closed</span>
                </div>
              </li>
            </ul>

            <div className="contact__cta">
              <strong>Book Your Free Evaluation</strong>
              <p>Walk in or schedule your visit for faster service.</p>
            </div>
          </aside>

          <form
            className="contact__form"
            onSubmit={onSubmit}
            data-aos="fade-left"
          >
            <h3 className="form__title">Book a Free Gold Evaluation</h3>

            <div className="grid-2">
              <label className="field">
                <span>Full Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={onChange}
                />
              </label>
              <label className="field">
                <span>Mobile Number</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={onChange}
                />
              </label>
            </div>

            <div className="grid-2">
              <label className="field">
                <span>Email Address (Optional)</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={onChange}
                />
              </label>
              <label className="field">
                <span>Type of Gold</span>
                <select
                  name="type"
                  required
                  value={form.type}
                  onChange={onChange}
                >
                  <option value="">Select type</option>
                  <option>Gold Jewelry</option>
                  <option>Broken Gold</option>
                  <option>Gold Coins</option>
                  <option>Gold Bars</option>
                  <option>Others</option>
                </select>
              </label>
            </div>

            <div className="grid-2">
              <label className="field">
                <span>Approximate Weight (Optional)</span>
                <input
                  type="text"
                  name="weight"
                  placeholder="e.g., 10 grams"
                  value={form.weight}
                  onChange={onChange}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter your area / city"
                  value={form.location}
                  onChange={onChange}
                />
              </label>
            </div>

            <label className="field">
              <span>Preferred Time to Contact</span>
              <select name="time" value={form.time} onChange={onChange}>
                <option value="">Select time</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </label>

            <label className="field">
              <span>Message (Optional)</span>
              <textarea
                name="message"
                rows="4"
                placeholder="Tell us about your requirement (optional)"
                value={form.message}
                onChange={onChange}
              />
            </label>

            <button type="submit" className="btn btn--gold btn--block">
              Get My Gold Value <FaArrowRight />
            </button>

            {sent && (
              <div className="form__success">
                <FaCheckCircle /> Thanks! We’ll contact you shortly with the
                best evaluation.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
