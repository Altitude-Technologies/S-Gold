import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase, isConfigured, IMAGE_BUCKET } from '../lib/supabase'

const Ctx = createContext(null)

// Map a DB row (snake_case) → app shape (camelCase)
function fromRow(r) {
  return {
    id: r.id,
    title: r.title,
    category: r.category || '',
    karat: r.karat || '',
    weight: r.weight ?? '',
    marketValue: r.market_value ?? '',
    hallmarkStatus: r.hallmark_status || '',
    artisanDetails: r.artisan_details || '',
    badge: r.badge || '',
    availability: r.availability || 'In Stock',
    status: r.status || 'draft',
    images: r.images || [],
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
  }
}

// Map an app-shape patch (camelCase, possibly partial) → DB row (snake_case),
// only including keys that were actually present in the patch.
function toPartialRow(patch) {
  const out = {}
  if ('title' in patch) out.title = patch.title
  if ('category' in patch) out.category = patch.category || null
  if ('karat' in patch) out.karat = patch.karat || null
  if ('weight' in patch)
    out.weight =
      patch.weight === '' || patch.weight == null ? null : Number(patch.weight)
  if ('marketValue' in patch)
    out.market_value =
      patch.marketValue === '' || patch.marketValue == null
        ? null
        : Number(patch.marketValue)
  if ('hallmarkStatus' in patch)
    out.hallmark_status = patch.hallmarkStatus || null
  if ('artisanDetails' in patch)
    out.artisan_details = patch.artisanDetails || null
  if ('badge' in patch) out.badge = patch.badge || null
  if ('availability' in patch) out.availability = patch.availability
  if ('status' in patch) out.status = patch.status
  if ('images' in patch) out.images = patch.images || []
  return out
}

export function GoldProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!isConfigured) {
      setError('Supabase is not configured. Check your .env.local file.')
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error: err } = await supabase
      .from('gold_items')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) {
      setError(err.message)
    } else {
      setItems((data || []).map(fromRow))
      setError(null)
    }
    setLoading(false)
  }, [])

  // Initial load
  useEffect(() => {
    refresh()
  }, [refresh])

  // Re-fetch whenever auth state changes — drafts become visible once admin signs in
  useEffect(() => {
    if (!isConfigured) return
    const { data } = supabase.auth.onAuthStateChange(() => {
      refresh()
    })
    return () => data.subscription.unsubscribe()
  }, [refresh])

  // Realtime: any change to gold_items auto-syncs across all open browsers
  useEffect(() => {
    if (!isConfigured) return
    const channel = supabase
      .channel('gold_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gold_items' },
        () => refresh()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refresh])

  const add = async (item) => {
    const { data, error: err } = await supabase
      .from('gold_items')
      .insert(toPartialRow(item))
      .select()
      .single()
    if (err) throw err
    return fromRow(data)
  }

  const update = async (id, patch) => {
    const partial = toPartialRow(patch)
    if (Object.keys(partial).length === 0) return
    const { error: err } = await supabase
      .from('gold_items')
      .update(partial)
      .eq('id', id)
    if (err) throw err
  }

  const remove = async (id) => {
    // Best-effort: also delete the item's images from storage
    const item = items.find((i) => i.id === id)
    if (item?.images?.length) {
      const paths = item.images
        .map((url) => storagePathFromUrl(url))
        .filter(Boolean)
      if (paths.length) {
        await supabase.storage.from(IMAGE_BUCKET).remove(paths)
      }
    }
    const { error: err } = await supabase.from('gold_items').delete().eq('id', id)
    if (err) throw err
  }

  return (
    <Ctx.Provider
      value={{ items, loading, error, refresh, add, update, remove }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useGold() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useGold must be inside <GoldProvider>')
  return c
}

// Extract the storage path from a public URL like:
//   https://xyz.supabase.co/storage/v1/object/public/gold-images/abc/def.jpg
//   → "abc/def.jpg"
export function storagePathFromUrl(url) {
  if (typeof url !== 'string') return null
  const marker = `/object/public/${IMAGE_BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}
