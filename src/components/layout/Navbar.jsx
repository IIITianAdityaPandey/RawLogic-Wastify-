import React, { useState, useEffect, useRef } from 'react';
import { GlowButton } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { auth } from '../../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css';

export const Navbar = () => {
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
    const [user, setUser] = useState(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const handleScroll = () => setHasScrolled(window.scrollY > 20);
        const handleHashChange = () => setCurrentPath(window.location.hash || '#/');

        // Close user dropdown when clicking outside
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('hashchange', handleHashChange);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            unsubscribe();
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('hashchange', handleHashChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsUserMenuOpen(false);
            window.location.hash = '#/';
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navClose = () => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

    return (
        <nav className={`navbar ${hasScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                {/* Brand */}
                <a href="#/" className="brand" onClick={navClose}>
                    <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7.77778V16.2222L12 22L22 16.2222V7.77778L12 2Z" stroke="var(--green-primary)" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M12 7V17M12 17L8 13M12 17L16 13" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="brand-text">Wastify</span>
                </a>

                {/* Desktop Nav Links - always visible core links */}
                <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    <a href="#/" className={currentPath === '#/' || currentPath === '' ? 'active' : ''} onClick={navClose}>Home</a>
                    <a href="#/marketplace" className={currentPath === '#/marketplace' ? 'active' : ''} onClick={navClose}>Marketplace</a>
                    <a href="#/analyze" className={`nav-analyze ${currentPath === '#/analyze' ? 'active' : ''}`} onClick={navClose}>✨ Analyze</a>
                    <a href="#/blog" className={currentPath === '#/blog' ? 'active' : ''} onClick={navClose}>Blog</a>

                    {/* Mobile-only: show these inside the drawer for logged-in users */}
                    {user && (
                        <div className="mobile-user-links">
                            <a href="#/dashboard" className={currentPath === '#/dashboard' ? 'active' : ''} onClick={navClose}>Dashboard</a>
                            <a href="#/community" className={currentPath === '#/community' ? 'active' : ''} onClick={navClose}>Community</a>
                            <a href="#/messages" className={currentPath.startsWith('#/messages') ? 'active' : ''} onClick={navClose}>💬 Inbox</a>
                            <button className="mobile-logout-btn" onClick={handleLogout}>Sign Out</button>
                        </div>
                    )}

                    {!user && (
                        <div className="mobile-cta">
                            <a href="#/login" className="login-link" onClick={navClose}>Login</a>
                            <GlowButton href="#/register" onClick={navClose}>Get Started Free</GlowButton>
                        </div>
                    )}
                </div>

                {/* Right side actions */}
                <div className="nav-actions">
                    <ThemeToggle />

                    {!user && (
                        <div className="desktop-cta">
                            <a href="#/login" className="login-link desktop-login">Login</a>
                            <GlowButton href="#/register">Get Started Free</GlowButton>
                        </div>
                    )}

                    {/* User Avatar Dropdown */}
                    {user && (
                        <div className="user-avatar-wrapper" ref={userMenuRef}>
                            <button
                                className="user-avatar-btn"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                aria-label="User menu"
                            >
                                {userInitial}
                            </button>

                            {isUserMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <span className="dropdown-email">{user.email}</span>
                                    </div>
                                    <a href="#/dashboard" className="dropdown-item" onClick={navClose}>
                                        <span>🗂️</span> Dashboard
                                    </a>
                                    <a href="#/community" className="dropdown-item" onClick={navClose}>
                                        <span>👥</span> Community
                                    </a>
                                    <a href="#/messages" className="dropdown-item" onClick={navClose}>
                                        <span>💬</span> Inbox
                                    </a>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item danger" onClick={handleLogout}>
                                        <span>🚪</span> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="hamburger"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && <div className="mobile-overlay" onClick={navClose}></div>}
        </nav>
    );
};
