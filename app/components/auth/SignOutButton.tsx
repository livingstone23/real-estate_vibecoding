'use client';

import React from 'react';
import { useI18n } from '../../../providers/I18nProvider';

export function SignOutButton() {
    const { t } = useI18n();

    const handleSignOut = async () => {
        await fetch('/auth/signout', {
            method: 'POST',
        });
        // We trigger a hard refresh to wipe server component cache
        window.location.href = '/';
    };

    return (
        <button
            onClick={handleSignOut}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-nordic-dark/5 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-colors text-nordic-dark dark:text-gray-300 ml-2"
            title="Sign Out"
        >
            <span className="material-icons text-xl">logout</span>
        </button>
    );
}
