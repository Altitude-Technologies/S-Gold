import { useState } from 'react'
import {
  FaInfoCircle,
  FaCog,
  FaCheckCircle,
  FaImage,
  FaTrash,
  FaEdit,
  FaArrowLeft,
  FaCloudUploadAlt,
  FaTimesCircle,
  FaStar,
} from 'react-icons/fa'
import { FaSignOutAlt } from 'react-icons/fa'
import { GiGoldBar } from 'react-icons/gi'
import { useGold } from '../contexts/GoldContext'
import { compressImage } from '../utils/image'
import { signOut } from '../utils/auth'
import { supabase, IMAGE_BUCKET } from '../lib/supabase'
import { storagePathFromUrl } from '../contexts/GoldContext'
import logo from '../assets/logo.png'

const CATEGORIES = [
  'Necklaces',
  'Bracelets',
  'Bangles',
  'Rings',
  'Chains',
  'Earrings',
  'Coins',
  'Bars',
  'Pendants',
  'Others',
]
const KARATS = ['24K', '22K', '18K', '14K']
const HALLMARK = ['Hallmarked', 'Pending Verification', 'Self-Certified']
const AVAILABILITY = ['In Stock', 'Booked', 'Sold']
const BADGES = [
  '',
  'Best Seller',
  'Verified Owner',
  'Best Value',
  'Featured',
  'Limited Stock',
  'Exclusive Stock',
  'New Arrival',
]

const MAX_IMAGES = 10
const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB raw — compressed before storing

const empty = {
  title: '',
  category: '',
  karat: '',
  weight: '',
  marketValue: '',
  hallmarkStatus: '',
  artisanDetails: '',
  badge: '',
  availability: 'In Stock',
  images: [],
  status: 'draft',
}

export default function Admin({ onLogout }) {
  const { items, add, update, remove } = useGold()
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState({ msg: '', tone: 'success' })
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const showToast = (msg, tone = 'success') => {
    setToast({ msg, tone })
    setTimeout(() => setToast({ msg: '', tone: 'success' }), 3500)
  }

  // Compress → upload to Supabase Storage → store the public URL.
  async function uploadOne(file) {
    const dataUrl = await compressImage(file)
    // dataUrl is "data:image/jpeg;base64,..."
    const blob = await (await fetch(dataUrl)).blob()
    const ext = 'jpg'
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
    const path = `items/${name}`
    const { error: upErr } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', upsert: false })
    if (upErr) throw upErr
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return
    const remaining = MAX_IMAGES - form.images.length
    if (remaining <= 0) {
      showToast(`Maximum ${MAX_IMAGES} images per product.`, 'error')
      return
    }
    const incoming = Array.from(fileList).slice(0, remaining)
    setBusy(true)
    const accepted = []
    let skipped = 0
    for (const file of incoming) {
      if (!file.type.startsWith('image/')) {
        skipped++
        continue
      }
      if (file.size > MAX_FILE_BYTES) {
        skipped++
        continue
      }
      try {
        const url = await uploadOne(file)
        accepted.push(url)
      } catch (e) {
        console.warn('upload failed:', e)
        skipped++
      }
    }
    setBusy(false)
    if (accepted.length) {
      setForm((f) => ({ ...f, images: [...f.images, ...accepted] }))
    }
    if (skipped) {
      showToast(
        `${skipped} file(s) skipped (unsupported, too large, or upload failed).`,
        'error'
      )
    } else if (accepted.length) {
      showToast(
        `${accepted.length} image${accepted.length > 1 ? 's' : ''} uploaded.`
      )
    }
  }

  const onPickFile = (e) => {
    handleFiles(e.target.files)
    // Reset so picking the same file again still triggers change.
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = async (index) => {
    const url = form.images[index]
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }))
    const path = storagePathFromUrl(url)
    if (path) {
      // Best-effort cleanup from storage; ignore failures.
      try {
        await supabase.storage.from(IMAGE_BUCKET).remove([path])
      } catch {
        /* ignore */
      }
    }
  }

  const movePrimary = (index) =>
    setForm((f) => {
      const next = [...f.images]
      const [pick] = next.splice(index, 1)
      next.unshift(pick)
      return { ...f, images: next }
    })

  const validate = () => {
    if (!form.title.trim()) return 'Please enter a title.'
    if (!form.category) return 'Please pick a category.'
    if (!form.karat) return 'Please pick a karat.'
    if (!form.weight) return 'Please enter weight.'
    if (!form.marketValue) return 'Please enter market valuation.'
    return ''
  }

  const submit = (status) => async () => {
    const err = validate()
    if (err) {
      showToast(err, 'error')
      return
    }
    const payload = { ...form, status }
    setBusy(true)
    try {
      if (editingId) {
        await update(editingId, payload)
        showToast(`Entry updated as ${status}.`)
      } else {
        await add(payload)
        showToast(
          status === 'published'
            ? 'Saved & published — visible to everyone.'
            : 'Saved as draft.'
        )
      }
      setForm(empty)
      setEditingId(null)
    } catch (e) {
      showToast(e?.message || 'Could not save.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const startEdit = (item) => {
    // Backward-compat for any legacy entries that used `image` (single).
    const images = item.images?.length
      ? item.images
      : item.image
      ? [item.image]
      : []
    setForm({
      ...empty,
      ...item,
      images,
      availability: item.availability || 'In Stock',
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setForm(empty)
    setEditingId(null)
  }

  const togglePublish = async (item) => {
    try {
      await update(item.id, {
        status: item.status === 'published' ? 'draft' : 'published',
      })
      showToast(
        item.status === 'published' ? 'Unpublished.' : 'Published — now live.'
      )
    } catch (e) {
      showToast(e?.message || 'Update failed.', 'error')
    }
  }

  const changeAvailability = async (item, value) => {
    try {
      await update(item.id, { availability: value })
      showToast(`Status updated to ${value}.`)
    } catch (e) {
      showToast(e?.message || 'Update failed.', 'error')
    }
  }

  return (
    <main className="admin">
      <div className="admin__brandbar">
        <div className="container admin__brandbar-inner">
          <a href="#/" className="admin__brand" aria-label="S Gold home">
            <img src={logo} alt="S Gold" />
          </a>
          <button
            type="button"
            className="btn btn--ghost btn--sm admin__logout"
            onClick={async () => {
              try {
                await signOut()
              } catch {
                /* ignore */
              }
              onLogout?.()
            }}
            title="Sign out"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      <div className="container">
        <header className="admin__head">
          <div>
            <a href="#/" className="admin__back">
              <FaArrowLeft /> Back to Site
            </a>
            <h1>{editingId ? 'Edit Gold Entry' : 'Create New Gold Entry'}</h1>
            <p className="muted">
              {editingId
                ? 'Update details and re-publish.'
                : 'Add a new piece to the inventory.'}
            </p>
          </div>
          <a href="#/gold" className="btn btn--ghost btn--sm">
            View Gold Inventory →
          </a>
        </header>

        <form className="admin__form" onSubmit={(e) => e.preventDefault()}>
          <div className="admin__panels">
            <section className="panel">
              <h2>
                <FaInfoCircle /> Basic Information
              </h2>
              <label className="field">
                <span>Piece Title</span>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="e.g., 22K Traditional Temple Necklace"
                />
              </label>
              <div className="grid-2">
                <label className="field">
                  <span>Category</span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={onChange}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Karat</span>
                  <select
                    name="karat"
                    value={form.karat}
                    onChange={onChange}
                  >
                    <option value="">Select karat</option>
                    {KARATS.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Status</span>
                <select
                  name="availability"
                  value={form.availability}
                  onChange={onChange}
                >
                  {AVAILABILITY.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
            </section>

            <section className="panel">
              <h2>
                <FaCog /> Specifications
              </h2>
              <div className="grid-2">
                <label className="field">
                  <span>Weight (in grams)</span>
                  <input
                    name="weight"
                    value={form.weight}
                    onChange={onChange}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </label>
                <label className="field">
                  <span>Market Valuation (in ₹)</span>
                  <input
                    name="marketValue"
                    value={form.marketValue}
                    onChange={onChange}
                    placeholder="0"
                    inputMode="numeric"
                  />
                </label>
              </div>
            </section>

            <section className="panel">
              <h2>
                <FaCheckCircle /> Localization &amp; Quality
              </h2>
              <div className="grid-2">
                <label className="field">
                  <span>BIS Hallmark Status</span>
                  <select
                    name="hallmarkStatus"
                    value={form.hallmarkStatus}
                    onChange={onChange}
                  >
                    <option value="">Select status</option>
                    {HALLMARK.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Artisan Details</span>
                  <input
                    name="artisanDetails"
                    value={form.artisanDetails}
                    onChange={onChange}
                    placeholder="e.g., Master Craftsman Ravi V."
                  />
                </label>
              </div>
              <label className="field">
                <span>Display Badge (Optional)</span>
                <select name="badge" value={form.badge} onChange={onChange}>
                  {BADGES.map((b) => (
                    <option key={b || 'none'} value={b}>
                      {b || '— No badge —'}
                    </option>
                  ))}
                </select>
              </label>
            </section>

            <section className="panel panel--media">
              <h2>
                <FaImage /> Media
                <span className="panel__hint">
                  {form.images.length}/{MAX_IMAGES}
                </span>
              </h2>

              {form.images.length === 0 ? (
                <label
                  className={`dropzone ${dragging ? 'is-dragging' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <div className="dropzone__empty">
                    <FaCloudUploadAlt />
                    <p>
                      <strong>Drag &amp; Drop Jewelry Photos</strong>
                    </p>
                    <small>JPG / PNG · up to 10 images · auto-compressed</small>
                    <span className="dropzone__btn">BROWSE FILES</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onPickFile}
                    hidden
                  />
                </label>
              ) : (
                <div className="media-grid">
                  {form.images.map((src, i) => (
                    <div className="media-thumb" key={i}>
                      <img src={src} alt={`Image ${i + 1}`} />
                      {i === 0 && (
                        <span className="media-thumb__primary">
                          <FaStar /> Primary
                        </span>
                      )}
                      <div className="media-thumb__actions">
                        {i !== 0 && (
                          <button
                            type="button"
                            onClick={() => movePrimary(i)}
                            title="Make primary"
                            className="media-thumb__star"
                          >
                            <FaStar />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          title="Remove"
                          className="media-thumb__remove"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    </div>
                  ))}

                  {form.images.length < MAX_IMAGES && (
                    <label
                      className={`media-add ${dragging ? 'is-dragging' : ''}`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragging(true)
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                    >
                      <FaCloudUploadAlt />
                      <span>+ Add ({MAX_IMAGES - form.images.length} left)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onPickFile}
                        hidden
                      />
                    </label>
                  )}
                </div>
              )}
              {busy && (
                <p className="media-hint">Compressing images…</p>
              )}
            </section>
          </div>

          <div className="admin__actions">
            {editingId && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className="btn btn--ghost"
              onClick={submit('draft')}
              disabled={busy}
            >
              {editingId ? 'Update Draft' : 'Save as Draft'}
            </button>
            <button
              type="button"
              className="btn btn--gold"
              onClick={submit('published')}
              disabled={busy}
            >
              {editingId ? 'Update & Publish' : 'Save and Publish'}
            </button>
          </div>
        </form>

        {toast.msg && (
          <div className={`admin__toast admin__toast--${toast.tone}`}>
            {toast.msg}
          </div>
        )}

        <section className="admin__list">
          <header className="admin__list-head">
            <h2>All Entries ({items.length})</h2>
            <div className="admin__list-counts">
              <span>
                {items.filter((i) => i.status === 'published').length} published
              </span>
              <span>
                {items.filter((i) => i.status === 'draft').length} drafts
              </span>
            </div>
          </header>

          {items.length === 0 ? (
            <div className="admin__empty">
              <GiGoldBar />
              <p>No entries yet. Add your first piece above.</p>
            </div>
          ) : (
            <div className="admin__rows">
              {items.map((it) => {
                const cover = it.images?.[0] || it.image
                return (
                  <article key={it.id} className="admin__row">
                    <div className="admin__row-img">
                      {cover ? (
                        <img src={cover} alt={it.title} />
                      ) : (
                        <div className="admin__row-noimg">
                          <FaImage />
                        </div>
                      )}
                      {it.images?.length > 1 && (
                        <span className="admin__row-count">
                          {it.images.length}
                        </span>
                      )}
                    </div>
                    <div className="admin__row-meta">
                      <h4>{it.title || 'Untitled'}</h4>
                      <small>
                        {it.category || '—'} · {it.karat || '—'} ·{' '}
                        {it.weight || '0'} g
                      </small>
                      <div className="admin__row-tags">
                        <span
                          className={`admin__status admin__status--${it.status}`}
                        >
                          {it.status}
                        </span>
                        <select
                          className={`avail-pill avail-pill--${(it.availability || 'In Stock').toLowerCase().replace(' ', '-')}`}
                          value={it.availability || 'In Stock'}
                          onChange={(e) =>
                            changeAvailability(it, e.target.value)
                          }
                          aria-label="Change status"
                        >
                          {AVAILABILITY.map((a) => (
                            <option key={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="admin__row-price">
                      <small>Value</small>
                      <strong>
                        ₹{' '}
                        {Number(it.marketValue || 0).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="admin__row-actions">
                      <button
                        type="button"
                        onClick={() => togglePublish(it)}
                        title={
                          it.status === 'published' ? 'Unpublish' : 'Publish'
                        }
                        className={
                          it.status === 'published'
                            ? 'admin__row-actions--published'
                            : ''
                        }
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(it)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm(`Delete "${it.title}"?`)) return
                          try {
                            await remove(it.id)
                            showToast('Entry deleted.')
                          } catch (e) {
                            showToast(e?.message || 'Delete failed.', 'error')
                          }
                        }}
                        title="Delete"
                        className="admin__row-actions--danger"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
