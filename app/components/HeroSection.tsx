'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchFiltersModal } from './SearchFiltersModal';
import { useI18n } from '../../providers/I18nProvider';

export const HeroSection = () => {
    const { t } = useI18n();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Derived state from URL for the main search input
    const currentQuery = searchParams.get('q') || '';
    const [searchInput, setSearchInput] = useState(currentQuery);

    const currentType = searchParams.get('type') || 'All';

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchInput.trim()) {
            params.set('q', searchInput.trim());
        } else {
            params.delete('q');
        }
        params.delete('page'); // Reset pagination
        router.push(`/?${params.toString()}`);
    };

    const handleTypeSelect = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type === 'All') {
            params.delete('type');
        } else {
            params.set('type', type);
        }
        params.delete('page');
        router.push(`/?${params.toString()}`);
    };

    const typeClasses = (type: string) => {
        const isActive = currentType === type || (type === 'All' && !searchParams.has('type'));
        return isActive
            ? "whitespace-nowrap px-5 py-2 rounded-full bg-nordic-dark text-white text-sm font-medium shadow-lg shadow-nordic-dark/10 transition-transform hover:-translate-y-0.5"
            : "whitespace-nowrap px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5";
    };

    return (
        <>
            <section className="py-12 md:py-16">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark dark:text-white leading-tight">
                        {t('Hero', 'title')}{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 font-medium">{t('Hero', 'titleBold')}</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
                        </span>
                        .
                    </h1>

                    <form onSubmit={handleSearchSubmit} className="relative group max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">search</span>
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="block w-full pl-12 pr-32 py-4 rounded-xl border-none bg-white dark:bg-white/5 text-nordic-dark dark:text-white shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-white/10 transition-all text-lg"
                            placeholder={t('Hero', 'searchPlaceholder')}
                        />
                        <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20">
                            {t('Hero', 'searchButton')}
                        </button>
                    </form>

                    <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
                        <button onClick={() => handleTypeSelect('All')} className={typeClasses('All')}>{t('Hero', 'chipAll')}</button>
                        <button onClick={() => handleTypeSelect('House')} className={typeClasses('House')}>{t('Hero', 'chipHouse')}</button>
                        <button onClick={() => handleTypeSelect('Apartment')} className={typeClasses('Apartment')}>{t('Hero', 'chipApartment')}</button>
                        <button onClick={() => handleTypeSelect('Villa')} className={typeClasses('Villa')}>{t('Hero', 'chipVilla')}</button>
                        <button onClick={() => handleTypeSelect('Penthouse')} className={typeClasses('Penthouse')}>{t('Hero', 'chipPenthouse')}</button>

                        <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="material-icons text-base">tune</span> {t('Hero', 'filtersButton')}
                        </button>
                    </div>
                </div>
            </section>

            {isModalOpen && <SearchFiltersModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};
