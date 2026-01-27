import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    sitemap({
      hostname: 'https://he1fire.github.io/riichi-mahjong/',
      dynamicRoutes: ['/ko', '/en', '/ja'],
      outDir: 'dist'
    })
  ],
  base: "/riichi-mahjong/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
