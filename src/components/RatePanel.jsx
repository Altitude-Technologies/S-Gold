import { useEffect, useState } from 'react'
import { FaCoins, FaSave, FaCheckCircle } from 'react-icons/fa'
import { useRate, formatAsOf } from '../contexts/RateContext'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function RatePanel() {
  const { rate24k, asOf, updatedAt, update, loading } = useRate()
  const [rate, setRate] = useState('')
  const [date, setDate] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({ text: '', tone: 'success' })

  useEffect(() => {
    if (rate24k) setRate(String(rate24k))
    setDate(asOf || todayISO())
  }, [rate24k, asOf])

  const showMsg = (text, tone = 'success') => {
    setMsg({ text, tone })
    setTimeout(() => setMsg({ text: '', tone: 'success' }), 3500)
  }

  const save = async () => {
    const n = Number(rate)
    if (!n || n <= 0) {
      showMsg('Please enter a valid rate.', 'error')
      return
    }
    if (!date) {
      showMsg('Please pick a date.', 'error')
      return
    }
    setBusy(true)
    try {
      await update(n, date)
      showMsg('Gold rate updated — live on the site.')
    } catch (e) {
      showMsg(e?.message || 'Update failed.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rate-panel">
      <div className="rate-panel__current">
        <div className="rate-panel__icon">
          <FaCoins />
        </div>
        <div>
          <small>Today's 24K Gold Rate</small>
          <strong>
            ₹ {loading ? '…' : rate24k.toLocaleString('en-IN')}
            <em> / g</em>
          </strong>
          <span className="rate-panel__date">
            {asOf
              ? `As of ${formatAsOf(asOf)}`
              : 'Not set yet — update below'}
          </span>
          {updatedAt && (
            <span className="rate-panel__updated">
              Last updated{' '}
              {new Date(updatedAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>

      <div className="rate-panel__form">
        <div className="rate-panel__inputs">
          <label className="field">
            <span>Rate (₹ per gram, 24K)</span>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g., 15219"
              inputMode="numeric"
              min="0"
              step="1"
            />
          </label>
          <label className="field">
            <span>As of Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayISO()}
            />
          </label>
        </div>

        <button
          type="button"
          className="btn btn--gold"
          onClick={save}
          disabled={busy}
        >
          {busy ? (
            'Updating…'
          ) : (
            <>
              <FaSave /> Update Rate
            </>
          )}
        </button>

        {msg.text && (
          <div className={`rate-panel__msg rate-panel__msg--${msg.tone}`}>
            {msg.tone === 'success' && <FaCheckCircle />}
            {msg.text}
          </div>
        )}
      </div>
    </section>
  )
}
