"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors w-6 h-6 flex items-center justify-center">
                <span className="material-icons opacity-0">light_mode</span>
            </button>
        );
    }

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
            aria-label="Toggle Dark Mode"
        >
            <span className="material-icons">
                {isDark ? "light_mode" : "dark_mode"}
            </span>
        </button>
    );
}
