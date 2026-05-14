import { useEffect, useState } from 'react'
import AOS from 'aos'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import WhyUs from './components/WhyUs'
import LiveValue from './components/LiveValue'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

import { GoldProvider } from './contexts/GoldContext'
import { RateProvider } from './contexts/RateContext'
import GoldInventory from './pages/GoldInventory'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import { getSession, onAuthChange } from './utils/auth'

import './App.css'

function getRoute() {
  const h = (typeof window !== 'undefined' && window.location.hash) || ''
  if (h.startsWith('#/admin')) return 'admin'
  if (h.startsWith('#/gold')) return 'gold'
  return 'home'
}

function App() {
  const [route, setRoute] = useState(getRoute)
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      anchorPlacement: 'top-bottom',
    })
  }, [])

  // Initial session + listen for auth changes
  useEffect(() => {
    let mounted = true
    getSession()
      .then((s) => {
        if (!mounted) return
        setSession(s)
        setAuthLoading(false)
      })
      .catch(() => {
        if (mounted) setAuthLoading(false)
      })
    const unsub = onAuthChange((s) => setSession(s))
    return () => {
      mounted = false
      unsub()
    }
  }, [])

  useEffect(() => {
    const onHash = () => {
      const next = getRoute()
      const h = window.location.hash || ''
      setRoute(next)
      if (next !== 'home') {
        window.scrollTo({ top: 0 })
      } else if (h.startsWith('#') && !h.startsWith('#/') && h.length > 1) {
        const id = h.slice(1)
        setTimeout(() => {
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
      }
      setTimeout(() => AOS.refresh(), 50)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const isAdmin = route === 'admin'
  const authed = !!session

  return (
    <RateProvider>
    <GoldProvider>
      {!isAdmin && <Navbar />}

      {isAdmin &&
        (authLoading ? (
          <main className="login">
            <div className="login__card" style={{ textAlign: 'center' }}>
              <p className="muted">Checking session…</p>
            </div>
          </main>
        ) : authed ? (
          <Admin onLogout={() => setSession(null)} />
        ) : (
          <AdminLogin />
        ))}

      {route === 'gold' && <GoldInventory />}
      {route === 'home' && (
        <main>
          <Hero />
          <About />
          <Services />
          <HowItWorks />
          <WhyUs />
          <LiveValue />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
      )}
      {!isAdmin && <Footer />}
    </GoldProvider>
    </RateProvider>
  )
}

export default App
