import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import hyTranslations from './locales/hy.json';

const DEFAULT_LANG = 'hy';

let initialLng = DEFAULT_LANG;
if (typeof window !== 'undefined') {
    try {
        const stored = window.localStorage.getItem('app_lang') || window.localStorage.getItem('i18nextLng');
        if (stored && typeof stored === 'string') {
            initialLng = stored;
        }
    } catch {
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslations },
            ru: { translation: ruTranslations },
            hy: { translation: hyTranslations },
        },
        lng: initialLng,
        fallbackLng: DEFAULT_LANG,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;