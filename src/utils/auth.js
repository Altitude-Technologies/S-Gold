// ──────────────────────────────────────────────────────────────────────
//  Admin credentials
// ──────────────────────────────────────────────────────────────────────
//  ⚠️  This is client-side gate-keeping, NOT real security.
//      Anyone who reads the JS bundle can see this hash and run an
//      offline brute-force against it. ALWAYS use a strong, unique
//      password (16+ chars, mixed case, digits, symbols).
//
//  Default credentials:
//      Username: admin
//      Password: SGold@2026   ← CHANGE THIS BEFORE DEPLOYING
//
//  How to change the password:
//      1. In any browser, open DevTools (F12) → Console
//      2. Paste and run:
//           crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_NEW_PASSWORD'))
//             .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
//      3. Copy the printed hash
//      4. Replace ADMIN_PASSWORD_HASH below with the new hash
//      5. (Optional) change ADMIN_USERNAME below
//      6. Rebuild and redeploy
// ──────────────────────────────────────────────────────────────────────

const ADMIN_USERNAME = 'sgold_admin'
const ADMIN_PASSWORD_HASH =
  '031c7fb36296b2b2b7d8481ae4a563066463a2b62519d3bbb0827a0295a62dcd'

const SESSION_KEY = 'sgold_admin_session_v1'
const SESSION_TTL_MINUTES = 60 // auto-logout after 60 min of session age

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  )
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyCredentials(username, password) {
  if (username !== ADMIN_USERNAME) return false
  const h = await sha256Hex(password)
  return h === ADMIN_PASSWORD_HASH
}

export function startSession() {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ at: Date.now() })
    )
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function isAuthed() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const { at } = JSON.parse(raw)
    if (typeof at !== 'number') return false
    if (Date.now() - at > SESSION_TTL_MINUTES * 60 * 1000) {
      clearSession()
      return false
    }
    return true
  } catch {
    return false
  }
}
