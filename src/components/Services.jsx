import {
  FaMoneyBillWave,
  FaSearchDollar,
  FaWeightHanging,
  FaChartLine,
  FaCreditCard,
} from 'react-icons/fa'
import { GiGoldBar } from 'react-icons/gi'

const services = [
  {
    icon: <FaMoneyBillWave />,
    title: 'Instant Cash for Gold',
    text: 'Turn your unused gold into liquidity within minutes. Old jewelry, broken pieces, outdated designs, single earrings or scrap — every piece has value.',
  },
  {
    icon: <FaSearchDollar />,
    title: 'Advanced Purity Testing',
    text: 'XRF (X-Ray Fluorescence) technology determines purity with no scratching, no melting, no damage. Result shown live on screen.',
  },
  {
    icon: <FaWeightHanging />,
    title: 'Transparent Weight Evaluation',
    text: 'Precision digital scales remove stones and non-gold parts. Net gold weight clearly shown — no manipulation, no confusion.',
  },
  {
    icon: <FaChartLine />,
    title: 'Live Market Price Calculation',
    text: 'Real-time gold rates, not outdated pricing. Value calculated from current rate × purity × net weight. Actual worth, not a guess.',
  },
  {
    icon: <FaCreditCard />,
    title: 'Instant & Flexible Payment',
    text: 'Choose how you get paid — Cash, UPI, or Bank Transfer. Payments processed within minutes.',
  },
  {
    icon: <GiGoldBar />,
    title: 'Gold Coins & Bars Purchase',
    text: 'We also buy investment-grade gold coins and gold bars of all sizes at competitive market rates.',
  },
]

export default function Services() {
  return (
    <section id="services" className="section section--dark">
      <div className="container">
        <div className="section__head" data-aos="fade-up">
          <span className="kicker">Our Services</span>
          <h2 className="section__title">
            Comprehensive <span className="text-gold">Gold Buying Solutions</span>
          </h2>
          <p className="section__lead">
            From scientific purity testing to instant payouts — every service is
            designed to give you total clarity and the best possible value.
          </p>
        </div>

        <div className="services">
          {services.map((s, i) => (
            <article
              key={s.title}
              className="service"
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 120}
            >
              <div className="service__glow" />
              <div className="service__num">0{i + 1}</div>
              <div className="service__icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
