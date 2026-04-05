import React, { useEffect } from 'react';
import '../App.css';

// Layout Components
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// Section Components
import { HeroSection } from '../components/sections/HeroSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { MaterialCategoriesSection } from '../components/sections/MaterialCategoriesSection';
import { StatsSection } from '../components/sections/StatsSection';
import { PricingSection } from '../components/sections/PricingSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { AIDeepDiveSection } from '../components/sections/AIDeepDiveSection';
import { CTASection } from '../components/sections/CTASection';

export const LandingPage = () => {
    useEffect(() => {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="app-container">
            <Navbar />
            <main>
                <HeroSection />
                <HowItWorksSection />
                <FeaturesSection />
                <MaterialCategoriesSection />
                <StatsSection />
                <PricingSection />
                <TestimonialsSection />
                <AIDeepDiveSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};
