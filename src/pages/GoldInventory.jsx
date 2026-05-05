import { useEffect, useMemo, useState } from 'react'
import { GiGoldBar } from 'react-icons/gi'
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
} from 'react-icons/fa'
import { useGold } from '../contexts/GoldContext'
import ProductModal from '../components/ProductModal'

const PAGE_SIZE = 6

function statusSlug(s = '') {
  return s.toLowerCase().replace(/\s+/g, '-')
}

export default function GoldInventory() {
  const { items } = useGold()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')
  const [openItem, setOpenItem] = useState(null)

  const published = useMemo(
    () => items.filter((i) => i.status === 'published'),
    [items]
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return published
    return published.filter((p) => p.category === filter)
  }, [published, filter])

  const categories = useMemo(() => {
    const set = new Set(published.map((p) => p.category).filter(Boolean))
    return ['all', ...set]
  }, [published])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [filter])

  return (
    <main className="inventory">
      <div className="inventory__bg">
        <div className="inventory__glow inventory__glow--1" />
        <div className="inventory__glow inventory__glow--2" />
      </div>

      <div className="container">
        <header className="inventory__head" data-aos="fade-up">
          <div>
            <span className="kicker">
              <GiGoldBar /> Curated Collection
            </span>
            <h1>
              Gold <span className="text-gold">Inventory</span>
            </h1>
            <p className="muted">
              Hand-picked pieces — every item hallmark verified and weight
              certified at S Gold. Click any piece for full details.
            </p>
          </div>
          <div className="inventory__rate">
            <GiGoldBar />
            <div>
              <small>Today's 24K Rate</small>
              <span>₹ 15,219 / g</span>
            </div>
          </div>
        </header>

        {published.length === 0 ? (
          <div className="inventory__empty" data-aos="zoom-in">
            <GiGoldBar />
            <h3>No items published yet</h3>
            <p>Items will appear here after they are published from admin.</p>
            <a href="#/admin" className="btn btn--gold btn--sm">
              Go to Admin <FaArrowRight />
            </a>
          </div>
        ) : (
          <>
            {categories.length > 2 && (
              <div className="inv-filters" data-aos="fade-up">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`inv-filter ${filter === c ? 'is-active' : ''}`}
                    onClick={() => setFilter(c)}
                  >
                    {c === 'all' ? 'All Pieces' : c}
                  </button>
                ))}
              </div>
            )}

            <div className="inventory__grid">
              {visible.map((it, i) => {
                const cover = it.images?.[0] || it.image
                const imgCount = it.images?.length || (it.image ? 1 : 0)
                const availability = it.availability || 'In Stock'
                const isSold = availability === 'Sold'
                const isBooked = availability === 'Booked'
                return (
                  <article
                    key={it.id}
                    className={`gcard gcard--${statusSlug(availability)}`}
                    data-aos="zoom-in-up"
                    data-aos-delay={(i % 3) * 100}
                    onClick={() => setOpenItem(it)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setOpenItem(it)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${it.title}`}
                  >
                    <div className="gcard__media">
                      {cover ? (
                        <img src={cover} alt={it.title} loading="lazy" />
                      ) : (
                        <div className="gcard__noimg">
                          <GiGoldBar />
                        </div>
                      )}
                      {imgCount > 1 && (
                        <span className="gcard__imgs">
                          <FaImages /> {imgCount}
                        </span>
                      )}
                      {it.badge && (
                        <span className="gcard__badge">{it.badge}</span>
                      )}
                      <div className="gcard__overlay" />
                      {(isSold || isBooked) && (
                        <div
                          className={`gcard__stamp gcard__stamp--${statusSlug(availability)}`}
                        >
                          {availability}
                        </div>
                      )}
                    </div>
                    <div className="gcard__body">
                      <div className="gcard__top">
                        <h3>{it.title}</h3>
                        <span
                          className={`status-pill status-pill--${statusSlug(availability)}`}
                        >
                          <span className="status-pill__dot" />
                          {availability}
                        </span>
                      </div>
                      <div className="gcard__meta">
                        <div>
                          <small>Karat</small>
                          <strong>{it.karat || '—'}</strong>
                        </div>
                        <div>
                          <small>Weight</small>
                          <strong>
                            {it.weight ? `${it.weight} Grams` : '—'}
                          </strong>
                        </div>
                      </div>
                      <div className="gcard__price">
                        <small>Market Value</small>
                        <strong>
                          ₹{' '}
                          {Number(it.marketValue || 0).toLocaleString(
                            'en-IN',
                            { maximumFractionDigits: 0 }
                          )}
                        </strong>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Inventory pagination">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    className={i + 1 === safePage ? 'is-active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage === totalPages}
                  aria-label="Next"
                >
                  <FaChevronRight />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {openItem && (
        <ProductModal item={openItem} onClose={() => setOpenItem(null)} />
      )}
    </main>
  )
}
