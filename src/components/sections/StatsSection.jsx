import React, { useEffect, useState, useRef } from 'react';
import './StatsSection.css';

export const StatsSection = () => {
    const [inView, setInView] = useState(false);
    const sectionRef = useRef(null);

    const [stats, setStats] = useState([
        { label: 'Tonnes of waste generated per year', value: 0, target: 2.01, prefix: '', suffix: 'B', isFloat: true },
        { label: 'In lost recyclable material value annually', value: 0, target: 410, prefix: '$', suffix: 'B+', isFloat: false },
        { label: 'Global waste management market size (2024)', value: 0, target: 38.5, prefix: '$', suffix: 'B', isFloat: true },
        { label: 'Of waste is mismanaged globally', value: 0, target: 33, prefix: '', suffix: '%', isFloat: false }
    ]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!inView) return;

        const duration = 2500;
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
            const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setStats(prev => prev.map(stat => ({
                ...stat,
                value: stat.target * easing
            })));
        }, interval);

        return () => clearInterval(timer);
    }, [inView]);

    return (
        <section className="impact-section" ref={sectionRef}>
            <div className="container">
                <div className="impact-grid">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="impact-stat delay-1 reveal">
                            <div className="impact-number">
                                {stat.prefix}
                                {stat.isFloat ? stat.value.toFixed(2) : Math.floor(stat.value)}
                                {stat.suffix}
                            </div>
                            <div className="impact-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
