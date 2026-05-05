import { useEffect, useRef, useState } from 'react'
import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaShieldAlt,
} from 'react-icons/fa'
import logo from '../assets/logo.png'
import { signIn } from '../utils/auth'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const emailRef = useRef(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setBusy(true)
    try {
      await signIn(email.trim(), password)
      // App.jsx onAuthStateChange will flip to the Admin view automatically.
    } catch (err) {
      setError(err?.message || 'Invalid credentials.')
      setPassword('')
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
              <FaEnvelope /> Email
            </span>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              disabled={busy}
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
                disabled={busy}
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
            disabled={busy}
          >
            {busy ? (
              'Signing in…'
            ) : (
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
