import { FaPhoneAlt, FaArrowRight } from 'react-icons/fa'
import { GiGoldBar, GiTwoCoins, GiDiamondRing } from 'react-icons/gi'
import { MdVerified } from 'react-icons/md'
import { useRate } from '../contexts/RateContext'

export default function Hero() {
  const { rate24k } = useRate()
  return (
    <section id="home" className="hero">
      <div className="hero__bg">
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content" data-aos="fade-right" data-aos-duration="900">
          <span className="eyebrow">
            <span className="eyebrow__dot" /> Live Gold Rate · Instant Payment
          </span>
          <h1 className="hero__title">
            Turn Your Gold into{' '}
            <span className="text-gold shimmer">Instant Cash</span>
            <br />
            Safely &amp; Transparently
          </h1>
          <p className="hero__sub">
            At <strong>S Gold</strong>, we redefine how you sell gold. No
            confusion. No hidden cuts. Just accurate evaluation, honest pricing,
            and instant payment — all in front of you.
          </p>

          <div className="hero__cta">
            <a href="#contact" className="btn btn--gold">
              Get My Gold Value <FaArrowRight />
            </a>
            <a href="tel:+917358453393" className="btn btn--ghost">
              <FaPhoneAlt /> Call Now
            </a>
          </div>

          <ul className="trust">
            <li>
              <MdVerified /> Live Gold Rate
            </li>
            <li>
              <MdVerified /> Instant Payment
            </li>
            <li>
              <MdVerified /> 100% Transparent
            </li>
          </ul>
        </div>

        <div
          className="hero__visual"
          data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          <div className="orbit">
            <div className="orbit__core">
              <GiGoldBar />
            </div>
            <div className="orbit__ring orbit__ring--1" />
            <div className="orbit__ring orbit__ring--2" />
            <div className="orbit__ring orbit__ring--3" />
            <span className="orbit__coin orbit__coin--1">
              <GiTwoCoins />
            </span>
            <span className="orbit__coin orbit__coin--2">
              <GiDiamondRing />
            </span>
            <span className="orbit__coin orbit__coin--3">
              <GiTwoCoins />
            </span>
            <span className="orbit__coin orbit__coin--4">
              <GiGoldBar />
            </span>
          </div>

          <div className="hero__chip hero__chip--rate" data-float>
            <span className="hero__chip-label">Today's Rate · 24K</span>
            <span className="hero__chip-value">
              ₹ <em>{rate24k.toLocaleString('en-IN')}</em>/g
            </span>
          </div>
          <div className="hero__chip hero__chip--xrf" data-float>
            <span className="hero__chip-pulse" />
            XRF Live Testing
          </div>
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label="Scroll">
        <span />
      </a>
    </section>
  )
}
