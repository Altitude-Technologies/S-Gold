import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'sgold_inventory_v1'
const Ctx = createContext(null)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function GoldProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch (err) {
      console.warn('localStorage write failed (likely full):', err)
    }
  }, [items])

  const add = (item) =>
    setItems((prev) => [
      {
        ...item,
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
      },
      ...prev,
    ])

  const update = (id, patch) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch } : i))
    )

  const remove = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <Ctx.Provider value={{ items, add, update, remove }}>
      {children}
    </Ctx.Provider>
  )
}

export function useGold() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useGold must be inside <GoldProvider>')
  return c
}
