import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase env vars missing. Create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(url || 'http://placeholder.invalid', anonKey || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})

export const isConfigured = Boolean(url && anonKey)
export const IMAGE_BUCKET = 'gold-images'
