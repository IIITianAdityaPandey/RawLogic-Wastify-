import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className={`theme-toggle-slider ${theme}`}>
                <span className="icon sun">☀️</span>
                <span className="icon moon">🌙</span>
                <div className="theme-toggle-knob"></div>
            </div>
        </button>
    );
};
