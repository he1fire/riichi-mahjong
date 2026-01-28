import { createI18n } from 'vue-i18n'
import ko from '@/locales/ko.json'
import en from '@/locales/en.json'
import ja from '@/locales/ja.json'

const getLanguage = () => {
  // 1순위: 사용자가 직접 바꾼 기록 (localStorage)
    const saveLang=localStorage.getItem('language');
    if (saveLang)
        return saveLang;
  // 2순위: 브라우저 언어 유추 (navigator.language)
    const browserLang=navigator.language.split('-')[0]; // 'ko-KR' -> 'ko'
    const supported=['ko', 'en', 'ja'];
    if (supported.includes(browserLang))
        return browserLang;

  // 3순위: 그것도 아니면 무조건 'en'
    return 'en';
};

/**i18n 설정*/
const i18n = createI18n({
    legacy: false, // Composition API 모드로 전환
    locale: getLanguage(),
    fallbackLocale: 'en',
    messages: {
        ko,
        en,
        ja
    }
})

export default i18n