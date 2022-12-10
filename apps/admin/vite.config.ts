import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    tsconfigPaths({ root: __dirname }),
    react()
  ]
})
