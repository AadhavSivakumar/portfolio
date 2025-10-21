import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './Icons';

const ThemeSwitcher: React.FC = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') {
            return 'light';
        }
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:text-accent hover:bg-surface transition-colors duration-500"
            aria-label="Toggle theme"
        >
            <SunIcon className={`absolute transition-all duration-500 ease-in-out ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
            <MoonIcon className={`absolute transition-all duration-500 ease-in-out ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
        </button>
    );
};

export default ThemeSwitcher;