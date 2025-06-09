import { createI18n } from 'vue-i18n'
import ko from '@/locales/ko.json'
import en from '@/locales/en.json'
import ja from '@/locales/ja.json'

const i18n = createI18n({
    legacy: false, // Composition API 모드로 전환
    locale: localStorage.getItem('language') || 'ko',
    fallbackLocale: 'ko',
    messages: {
        ko,
        en,
        ja
    }
})

export default i18n