import { cookies } from 'next/headers';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';

const dictionaries: Record<string, any> = { en, es, fr };
export const defaultLocale = 'en';

export async function getServerTranslations() {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
    const dict = dictionaries[locale] || dictionaries[defaultLocale];

    const t = (namespace: string, key: string, params?: Record<string, string | number>) => {
        let text = dict?.[namespace]?.[key];

        if (!text) {
            text = dictionaries[defaultLocale]?.[namespace]?.[key] || `${namespace}.${key}`;
        }

        if (params && text) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, String(v));
            });
        }
        return text;
    };

    return { t, locale };
}
