import { FaQuoteLeft, FaStar } from 'react-icons/fa'

const reviews = [
  'I checked multiple shops, but S Gold gave the best rate with full clarity.',
  'They explained every step — I felt confident and safe selling my old jewelry.',
  'Fast, professional, and honest service. Payment was instant.',
  'Best gold rate and very transparent process. I’ll be back without hesitation.',
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="section section--dark">
      <div className="container">
        <div className="section__head" data-aos="fade-up">
          <span className="kicker">Customer Experience</span>
          <h2 className="section__title">
            Real People. <span className="text-gold">Real Trust.</span>
          </h2>
          <p className="section__lead">
            Honest words from customers who walked in unsure and walked out with
            confidence.
          </p>
        </div>

        <div className="reviews">
          {reviews.map((quote, i) => (
            <figure
              key={i}
              className="review"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <FaQuoteLeft className="review__quote" />
              <div className="review__stars">
                {Array.from({ length: 5 }).map((_, k) => (
                  <FaStar key={k} />
                ))}
              </div>
              <blockquote>{quote}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
