'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setLocaleCookie } from '../app/actions/locale';

// Import all dictionaries
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';

const dictionaries: Record<string, any> = { en, es, fr, de };
export const supportedLocales = Object.keys(dictionaries);
export const defaultLocale = 'en';

type I18nContextType = {
    locale: string;
    t: (namespace: string, key: string, params?: Record<string, string | number>) => string;
    changeLocale: (newLocale: string) => Promise<void>;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
    children,
    initialLocale
}: {
    children: React.ReactNode;
    initialLocale: string;
}) {
    const [locale, setLocale] = useState(initialLocale);
    const [dict, setDict] = useState(dictionaries[initialLocale]);

    const changeLocale = async (newLocale: string) => {
        if (!supportedLocales.includes(newLocale)) return;
        setLocale(newLocale);
        setDict(dictionaries[newLocale]);
        // Persist to cookie via server action
        await setLocaleCookie(newLocale);
    };

    // Simple translation function supporting namespaces and basic interpolation
    // Usage: t('Hero', 'title') or t('PropertyCard', 'beds', { count: 3 })
    const t = (namespace: string, key: string, params?: Record<string, string | number>) => {
        let text = dict?.[namespace]?.[key];

        // Fallback to English if translation is missing in current locale
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

    return (
        <I18nContext.Provider value={{ locale, t, changeLocale }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
