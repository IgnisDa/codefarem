import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    tsconfigPaths({ root: dirname }),
    react()
  ]
})
