import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    sitemap({
      hostname: 'https://he1fire.github.io', // 여기는 도메인만!
      dynamicRoutes: [
        '/riichi-mahjong/',   // 메인
        '/riichi-mahjong/ko', // 한국어
        '/riichi-mahjong/en', // 영어
        '/riichi-mahjong/ja'  // 일본어
      ],
      exclude: ['/', '/404'],
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
