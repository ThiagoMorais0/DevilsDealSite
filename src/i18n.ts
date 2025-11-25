import { createI18n } from 'vue-i18n'
import pt from './locales/pt.json'
import en from './locales/en.json'

const getBrowserLocale = () => {
    const navigatorLocale = navigator.language.toLowerCase()
    if (navigatorLocale.startsWith('pt')) {
        return 'pt'
    }
    return 'en'
}

const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: getBrowserLocale(),
    fallbackLocale: 'en',
    messages: {
        pt,
        en
    }
})

export default i18n
