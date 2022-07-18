import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5001
  },
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 600
  },
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('tailwindcss/nesting'),
        require('tailwindcss'),
        require('postcss-simple-vars'),
        require('postcss-import'),
        require('cssnano'),
      ],
    }
  }
})
