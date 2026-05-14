import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const Ctx = createContext(null)
const KEY = 'gold_rate'
const DEFAULT_RATE = 15219

export function RateProvider({ children }) {
  const [rate24k, setRate24k] = useState(DEFAULT_RATE)
  const [asOf, setAsOf] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('app_settings')
      .select('value, updated_at')
      .eq('key', KEY)
      .maybeSingle()
    if (!error && data) {
      const v = data.value || {}
      setRate24k(Number(v.rate_24k) || DEFAULT_RATE)
      setAsOf(v.as_of || null)
      setUpdatedAt(data.updated_at || null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Realtime: rate updates from admin propagate to every open browser instantly
  useEffect(() => {
    if (!isConfigured) return
    const channel = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings',
          filter: `key=eq.${KEY}`,
        },
        () => refresh()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refresh])

  const update = async (newRate24k, newAsOf) => {
    const { error } = await supabase
      .from('app_settings')
      .upsert(
        {
          key: KEY,
          value: { rate_24k: Number(newRate24k), as_of: newAsOf },
        },
        { onConflict: 'key' }
      )
    if (error) throw error
  }

  return (
    <Ctx.Provider value={{ rate24k, asOf, updatedAt, loading, update, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function useRate() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useRate must be inside <RateProvider>')
  return c
}

// Format an ISO date string (YYYY-MM-DD) into "29 Apr 2026"
export function formatAsOf(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}
