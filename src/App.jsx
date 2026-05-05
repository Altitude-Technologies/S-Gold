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
import GoldInventory from './pages/GoldInventory'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import { isAuthed } from './utils/auth'

import './App.css'

function getRoute() {
  const h = (typeof window !== 'undefined' && window.location.hash) || ''
  if (h.startsWith('#/admin')) return 'admin'
  if (h.startsWith('#/gold')) return 'gold'
  return 'home'
}

function App() {
  const [route, setRoute] = useState(getRoute)
  const [authed, setAuthed] = useState(() => isAuthed())

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      anchorPlacement: 'top-bottom',
    })
  }, [])

  useEffect(() => {
    const onHash = () => {
      const next = getRoute()
      setRoute(next)
      // Re-check session each time admin route is entered.
      if (next === 'admin') setAuthed(isAuthed())
      if (next !== 'home') {
        window.scrollTo({ top: 0 })
      }
      setTimeout(() => AOS.refresh(), 50)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const isAdmin = route === 'admin'

  return (
    <GoldProvider>
      {!isAdmin && <Navbar />}

      {isAdmin &&
        (authed ? (
          <Admin onLogout={() => setAuthed(false)} />
        ) : (
          <AdminLogin onSuccess={() => setAuthed(true)} />
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
  )
}

export default App
