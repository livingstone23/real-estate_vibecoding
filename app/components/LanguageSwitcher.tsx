'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../providers/I18nProvider';

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
    const { locale, changeLocale } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const current = languages.find(l => l.code === locale) ?? languages[0];

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code: string) => {
        setIsOpen(false);
        changeLocale(code);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all text-nordic-dark/70 hover:text-nordic-dark hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                aria-label="Select language"
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span className="hidden sm:inline">{current.label}</span>
                <span className="material-icons text-sm leading-none">
                    {isOpen ? 'expand_less' : 'expand_more'}
                </span>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-gray-900 border border-nordic-dark/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
                                ${lang.code === locale
                                    ? 'bg-mosque/10 text-mosque font-semibold'
                                    : 'text-nordic-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="text-base">{lang.flag}</span>
                            {lang.label}
                            {lang.code === locale && (
                                <span className="material-icons text-mosque text-sm ml-auto">check</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
