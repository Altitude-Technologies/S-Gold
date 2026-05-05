import { useEffect, useState } from 'react'
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from 'react-icons/fa'
import { GiGoldBar } from 'react-icons/gi'

function statusSlug(s = '') {
  return s.toLowerCase().replace(/\s+/g, '-')
}

export default function ProductModal({ item, onClose }) {
  const images = item.images?.length
    ? item.images
    : item.image
    ? [item.image]
    : []
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (images.length > 1) {
        if (e.key === 'ArrowLeft')
          setActive((a) => (a - 1 + images.length) % images.length)
        if (e.key === 'ArrowRight')
          setActive((a) => (a + 1) % images.length)
      }
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [images.length, onClose])

  const availability = item.availability || 'In Stock'
  const isSold = availability === 'Sold'
  const isBooked = availability === 'Booked'

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <div className="modal__gallery">
          <div className="modal__main">
            {images.length ? (
              <img
                key={active}
                src={images[active]}
                alt={item.title}
                className="modal__main-img"
              />
            ) : (
              <div className="modal__noimg">
                <GiGoldBar />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="modal__nav modal__nav--prev"
                  onClick={() =>
                    setActive((a) => (a - 1 + images.length) % images.length)
                  }
                  aria-label="Previous"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="modal__nav modal__nav--next"
                  onClick={() => setActive((a) => (a + 1) % images.length)}
                  aria-label="Next"
                >
                  <FaChevronRight />
                </button>
                <span className="modal__count">
                  {active + 1} / {images.length}
                </span>
              </>
            )}

            {(isSold || isBooked) && (
              <div className={`modal__stamp modal__stamp--${statusSlug(availability)}`}>
                {availability}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="modal__thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={`modal__thumb ${i === active ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal__details">
          <span
            className={`status-pill status-pill--${statusSlug(availability)}`}
          >
            <span className="status-pill__dot" />
            {availability}
          </span>

          <h2 className="modal__title">{item.title}</h2>

          <div className="modal__specs">
            <div>
              <small>Category</small>
              <strong>{item.category || '—'}</strong>
            </div>
            <div>
              <small>Karat</small>
              <strong>{item.karat || '—'}</strong>
            </div>
            <div>
              <small>Weight</small>
              <strong>
                {item.weight ? `${item.weight} g` : '—'}
              </strong>
            </div>
          </div>

          <div className="modal__price">
            <small>Market Value</small>
            <strong>
              ₹ {Number(item.marketValue || 0).toLocaleString('en-IN')}
            </strong>
          </div>

          <div className="modal__cta">
            {isSold ? (
              <button
                type="button"
                className="btn btn--ghost btn--block"
                disabled
              >
                This piece has been sold
              </button>
            ) : (
              <a
                href="#contact"
                className="btn btn--gold btn--block"
                onClick={onClose}
              >
                Enquire About This Piece <FaArrowRight />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
