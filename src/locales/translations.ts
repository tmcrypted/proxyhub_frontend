import enTranslations from './en.json';
import ruTranslations from './ru.json';

export const translations = {
    en: enTranslations,
    ru: ruTranslations
} as const;

export type TranslationKey = keyof typeof enTranslations; 