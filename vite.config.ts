import { defineConfig } from 'vite'
import { resolve } from 'path';
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    copyPublicDir:false,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es']
    },
  },
  plugins: [
    react(), 
    dts({ tsconfigPath: resolve(__dirname, "tsconfig.lib.json"), }),
  ],
})
