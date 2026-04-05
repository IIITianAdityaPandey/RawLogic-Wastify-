import React from 'react';
import './HowItWorksSection.css';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const HowItWorksSection = () => {
    return (
        <section className="how-section container" id="how-it-works">
            <div className="section-header text-center reveal">
                <h2>From Photo to <span className="text-green">Profit</span> in 3 Steps</h2>
                <p className="section-subtitle">A seamless process to transform your surplus materials into working capital.</p>
            </div>

            <div className="steps-container reveal delay-1">

                {/* Connection Line */}
                <div className="steps-connection-line">
                    <div className="animated-dash"></div>
                </div>

                <div className="step-card">
                    <div className="step-circle"><AnimatedNumber target={1} /></div>
                    <div className="step-icon">📸</div>
                    <h3>Upload</h3>
                    <p>Drag and drop or photograph your waste/surplus items. Supports JPEG, PNG, HEIC, WebP. Up to <AnimatedNumber target={10} /> images per listing.</p>
                </div>

                <div className="step-card">
                    <div className="step-circle"><AnimatedNumber target={2} /></div>
                    <div className="step-icon">🧠</div>
                    <h3>AI Classifies</h3>
                    <p>Our YOLOv8 computer vision engine identifies material type, condition score (1–10), purity estimate (%), and reusability tag across <AnimatedNumber target={12} /> categories with {'>'}<AnimatedNumber target={92} suffix="%" /> accuracy.</p>
                </div>

                <div className="step-card">
                    <div className="step-circle"><AnimatedNumber target={3} /></div>
                    <div className="step-icon">🤝</div>
                    <h3>Get Matched</h3>
                    <p>Smart buyer-matching algorithm scores and surfaces verified buyers/recyclers ranked by match score, distance, and transaction history. Instant notifications.</p>
                </div>

            </div>
        </section>
    );
};
