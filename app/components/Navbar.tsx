import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getServerTranslations } from '../../lib/i18n';
import { createClient } from '../../utils/supabase/server';
import { SignOutButton } from './auth/SignOutButton';

export const Navbar = async () => {
    const { t } = await getServerTranslations();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // We try to extract an avatar URL, or fallback to a default image for demo purposes
    const avatarUrl = user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA";
    return (
        <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-nordic-dark/10 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
                            <span className="material-icons text-white text-lg">apartment</span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-nordic-dark dark:text-white">LuxeEstate</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">{t('Navbar', 'buy')}</a>
                        <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('Navbar', 'rent')}</a>
                        <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('Navbar', 'sell')}</a>
                        <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('Navbar', 'savedHomes')}</a>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors">
                            <span className="material-icons">search</span>
                        </button>
                        <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors relative">
                            <span className="material-icons">notifications_none</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                        </button>
                        <LanguageSwitcher />
                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10 ml-2">
                                <Link href="/profile" className="flex items-center">
                                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                                        <img
                                            alt={user.user_metadata?.full_name || "Profile"}
                                            className="w-full h-full object-cover"
                                            src={avatarUrl}
                                        />
                                    </div>
                                </Link>
                                <SignOutButton />
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 pl-4 border-l border-nordic-dark/10 dark:border-white/10 ml-2">
                                <span className="text-sm font-medium text-nordic-dark hover:text-mosque dark:text-white transition-colors">{t('Navbar', 'signIn') || 'Sign In'}</span>
                                <div className="w-9 h-9 rounded-full bg-nordic-dark/5 dark:bg-white/10 flex items-center justify-center text-nordic-dark dark:text-white hover:bg-mosque hover:text-white transition-all">
                                    <span className="material-icons text-xl">login</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Hidden by default in CSS, simplified for React) */}
            <div className="md:hidden border-t border-nordic-dark/5 bg-background-light dark:bg-background-dark overflow-hidden h-0 transition-all duration-300">
                <div className="px-4 py-2 space-y-1">
                    <a className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="#">{t('Navbar', 'buy')}</a>
                    <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('Navbar', 'rent')}</a>
                    <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('Navbar', 'sell')}</a>
                    <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('Navbar', 'savedHomes')}</a>
                </div>
            </div>
        </nav>
    );
};
