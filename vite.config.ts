import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    sitemap({
      // 1. hostname은 도메인까지만 적어줍니다.
      hostname: 'https://he1fire.github.io', 
      // 2. 경로에 프로젝트 이름을 직접 포함시킵니다.
      dynamicRoutes: [
        '/riichi-mahjong/ko',
        '/riichi-mahjong/en',
        '/riichi-mahjong/ja'
      ],
      // 3. 필요 없는 404 페이지는 제외합니다.
      exclude: ['/404'],
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
