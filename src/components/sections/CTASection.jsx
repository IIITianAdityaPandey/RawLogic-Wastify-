import React from 'react';
import { GlowButton, OutlineButton } from '../ui/Button';
import './CTASection.css';

export const CTASection = () => {
    return (
        <section className="cta-section" id="cta">
            <div className="container text-center reveal">
                <div className="cta-content">
                    <h2>Start Turning Waste Into <span className="text-green">Revenue</span> Today</h2>
                    <p className="section-subtitle cta-subtitle">
                        Join sellers, buyers, and municipalities already using Wastify to close the loop on waste.
                    </p>
                    <div className="cta-buttons">
                        <GlowButton href="#/register">Start Free Trial</GlowButton>
                        <OutlineButton href="#/register">Book a Demo</OutlineButton>
                    </div>
                </div>
            </div>
        </section>
    );
};
