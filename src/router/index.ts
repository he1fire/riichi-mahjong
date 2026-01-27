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

  // 1. i18n 언어 설정 업데이트
  if (i18n.global.locale.value!==locale)
    i18n.global.locale.value=locale;

  // 2. Canonical 태그 동적 업데이트 로직 추가
  const baseUrl = 'https://he1fire.github.io/riichi-mahjong';
  // 루트 경로(/)일 때는 baseUrl만, 언어 경로가 있을 때는 /en 등을 붙임
  const canonicalUrl = to.params.locale ? `${baseUrl}/${to.params.locale}` : `${baseUrl}/`;
  let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
  
  if (link)
    link.setAttribute('href', canonicalUrl);
  else {
    // 혹시라도 태그가 없으면 새로 생성
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }
  
  next();
})

export default router