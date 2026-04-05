import React, { useEffect, useState } from 'react';
import { GlowButton, OutlineButton } from '../ui/Button';
import './HeroSection.css';

export const HeroSection = () => {
    const [stats, setStats] = useState([
        { label: 'Tonnes/Year Waste Generated', value: 0, target: 2.01, prefix: '', suffix: 'B', isFloat: true },
        { label: 'Lost Material Value', value: 0, target: 410, prefix: '$', suffix: 'B+', isFloat: false },
        { label: 'Mismanaged Globally', value: 0, target: 33, prefix: '', suffix: '%', isFloat: false },
        { label: 'AI Match Time', value: 0, target: 30, prefix: '<', suffix: 's', isFloat: false }
    ]);

    useEffect(() => {
        // Simple counter animation on mount
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            if (currentStep > steps) {
                clearInterval(timer);
                return;
            }

            const progress = currentStep / steps;
            // easeOutExpo
            const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setStats(prev => prev.map(stat => ({
                ...stat,
                value: stat.target * easing
            })));
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero-section" id="hero">
            {/* Background Orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            <div className="hero-grid-bg"></div>

            <div className="container hero-content">
                <div className="hero-text fade-up-element reveal">
                    <h1>Turn Waste Into <span className="text-green">Raw Material Intelligence</span></h1>
                    <p className="hero-subtext">
                        Upload a photo. Our AI classifies your discarded materials in seconds and connects you with verified buyers, recyclers, and manufacturers — in real time.
                    </p>
                    <div className="hero-ctas">
                        <GlowButton href="#/register">Start Free Trial</GlowButton>
                        <OutlineButton href="#/login">Watch Demo</OutlineButton>
                    </div>
                </div>

                <div className="hero-visual fade-up-element reveal delay-2">
                    {/* Animated SVG Diagram */}
                    <div className="diagram-container">
                        <svg viewBox="0 0 600 300" className="hero-svg-flow">
                            <defs>
                                <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="var(--green-glow)" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Connecting Lines */}
                            <path d="M 120 150 L 250 150" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 6" className="flow-line" />
                            <path d="M 350 150 L 480 150" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 6" className="flow-line" />

                            {/* Node 1: Waste Item */}
                            <circle cx="90" cy="150" r="40" fill="var(--bg-card)" stroke="var(--text-muted)" strokeWidth="2" />
                            <g className="waste-item-cycle">
                                <text x="90" y="160" textAnchor="middle" fontSize="30">💻</text>
                            </g>

                            {/* Node 2: Scanner / AI Engine */}
                            <rect x="250" y="110" width="100" height="80" rx="12" fill="var(--bg-secondary)" stroke="var(--green-primary)" strokeWidth="2" filter="url(#glow)" />
                            <text x="300" y="155" textAnchor="middle" fill="var(--green-primary)" fontFamily="var(--font-mono)" fontSize="14" fontWeight="600">YOLOv8</text>

                            {/* Node 3: Classified & Matched */}
                            <circle cx="510" cy="150" r="40" fill="var(--bg-card)" stroke="var(--green-primary)" strokeWidth="2" />
                            <text x="510" y="155" textAnchor="middle" fill="var(--text-primary)" fontSize="24">♻️</text>

                            {/* Scanning Beam Animation */}
                            <rect x="220" y="90" width="10" height="120" fill="url(#beam)" className="scanner-beam" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="stats-strip reveal delay-3">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-item">
                                <div className="stat-number">
                                    {stat.prefix}
                                    {stat.isFloat ? stat.value.toFixed(2) : Math.floor(stat.value)}
                                    {stat.suffix}
                                </div>
                                <div className="stat-text">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
