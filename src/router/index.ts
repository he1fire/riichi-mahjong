import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import i18n from '@/i18n/i18n.ts'

const routes = [
  {
    path: '/', // 홈 경로 추가
    redirect: `/${i18n.global.locale.value}` // 기본 언어로 리다이렉트
  },
  {
    path: '/:pathMatch(.*)*', // 모든 미매칭 경로
    redirect: `/${i18n.global.locale.value}` // 기본 언어로 리다이렉트
  },
  {
    path: '/:locale(ko|en|ja)', // 언어별 경로
    component: App, // 실행할 컴포넌트
  },
]

const router = createRouter({
  history: createWebHistory('/riichi-mahjong'), // 기본 경로 지정
  routes,
})

router.beforeEach((to, _from, next) => {
  const locale=(to.params.locale as 'ko'|'en'|'ja');
  if (i18n.global.locale.value!==locale)
    i18n.global.locale.value=locale;
  next()
})

export default router