import { useEffect, useRef, useState } from 'react'
import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaShieldAlt,
} from 'react-icons/fa'
import logo from '../assets/logo.png'
import { startSession, verifyCredentials } from '../utils/auth'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 60_000

export default function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockUntil, setLockUntil] = useState(0)
  const [, setTick] = useState(0)
  const userRef = useRef(null)

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  // Countdown ticker for the lock-out timer.
  useEffect(() => {
    if (!lockUntil) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [lockUntil])

  const remainingLock = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000))
  const locked = remainingLock > 0

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (locked) return
    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }
    setBusy(true)
    try {
      const ok = await verifyCredentials(username.trim(), password)
      if (ok) {
        startSession()
        onSuccess?.()
      } else {
        const next = attempts + 1
        setAttempts(next)
        if (next >= MAX_ATTEMPTS) {
          setLockUntil(Date.now() + LOCKOUT_MS)
          setError(
            `Too many failed attempts. Try again in ${LOCKOUT_MS / 1000}s.`
          )
          setAttempts(0)
        } else {
          setError(
            `Invalid credentials. ${MAX_ATTEMPTS - next} attempt(s) left.`
          )
        }
        setPassword('')
      }
    } catch (err) {
      setError('Authentication error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login">
      <div className="login__bg">
        <div className="login__glow login__glow--1" />
        <div className="login__glow login__glow--2" />
      </div>

      <a href="#/" className="login__back">
        <FaArrowLeft /> Back to Site
      </a>

      <div className="login__card">
        <div className="login__sheen" />
        <a href="#/" className="login__logo" aria-label="S Gold">
          <img src={logo} alt="S Gold" />
        </a>
        <h1 className="login__title">
          Admin <span className="text-gold">Access</span>
        </h1>
        <p className="login__sub">
          Enter your credentials to manage the inventory.
        </p>

        <form className="login__form" onSubmit={submit}>
          <label className="field">
            <span>
              <FaUser /> Username
            </span>
            <input
              ref={userRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              disabled={locked || busy}
            />
          </label>

          <label className="field">
            <span>
              <FaLock /> Password
            </span>
            <div className="login__pw">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={locked || busy}
              />
              <button
                type="button"
                className="login__pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          {error && <div className="login__error">{error}</div>}

          <button
            type="submit"
            className="btn btn--gold btn--block"
            disabled={busy || locked}
          >
            {busy
              ? 'Signing in…'
              : locked
              ? `Locked · ${remainingLock}s`
              : (
                <>
                  Sign In <FaArrowRight />
                </>
              )}
          </button>
        </form>

        <p className="login__note">
          <FaShieldAlt /> Authorized personnel only.
        </p>
      </div>
    </main>
  )
}
