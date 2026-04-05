import React, { useEffect, useState, useRef } from 'react';

export const AnimatedNumber = ({
    target,
    duration = 2000,
    prefix = '',
    suffix = '',
    isFloat = false,
    className = ''
}) => {
    const [value, setValue] = useState(0);
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!inView) return;

        const steps = 60;
        const interval = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            if (currentStep > steps) {
                setValue(target);
                clearInterval(timer);
                return;
            }

            const progress = currentStep / steps;
            // easeOutExpo
            const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(target * easing);

        }, interval);

        return () => clearInterval(timer);
    }, [inView, target, duration]);

    const displayValue = isFloat ? value.toFixed(2) : Math.floor(value);

    return (
        <span ref={ref} className={className}>
            {prefix}{displayValue}{suffix}
        </span>
    );
};
