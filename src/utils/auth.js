// Real auth backed by Supabase. Replaces the old client-side SHA-256 gate.
//
// How to create / change the admin credentials:
//   1. Open https://app.supabase.com → your project
//   2. Authentication → Users → "Add user"
//   3. Choose "Create new user", set email + password, confirm immediately
//   4. Use that email + password on the /admin login screen
//
// To rotate the password:
//   Authentication → Users → row → "Reset password" or "Send magic link"

import { supabase } from '../lib/supabase'

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session)
  })
  return () => data.subscription.unsubscribe()
}
