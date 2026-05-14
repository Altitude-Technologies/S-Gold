import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// Set `base` to match where the site is served from:
//   '/'         → root domain (e.g. https://sgoldtnj.com/)         ← Hostinger
//   '/S-Gold/'  → GitHub Pages subpath (https://...github.io/S-Gold/)
//
// Pick ONE and comment the others out before building.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
