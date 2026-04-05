import React, { useState } from 'react';
import { PricingCard } from '../ui/Card';
import './PricingSection.css';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const PricingSection = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = [
        {
            title: "Free",
            price: isAnnual ? "$0/mo" : "$0/mo",
            features: [
                "5 listings/month",
                "10 AI classifications/month",
                "3 buyer matches per listing",
                "Basic analytics",
                "5% transaction fee",
                "Community support"
            ],
            isPro: false,
            ctaText: "Start Free"
        },
        {
            title: "Pro",
            price: isAnnual ? "$39/mo" : "$49/mo",
            features: [
                "Unlimited listings",
                "500 AI classifications/month",
                "Unlimited buyer matches",
                "Advanced analytics + reports",
                "3% transaction fee",
                "Logistics integration",
                "QR label generation",
                "Read-only API access",
                "Email support (24h SLA)"
            ],
            isPro: true,
            ctaText: "Go Pro"
        },
        {
            title: "Enterprise",
            price: "Custom",
            features: [
                "Unlimited everything",
                <>Batch AI classification (<AnimatedNumber target={1000} /> imgs)</>,
                "Priority buyer matching",
                "Custom BI webhooks (Tableau, Power BI)",
                "Custom carrier logistics",
                "Full read/write API access",
                "1% transaction fee",
                "99.9% uptime SLA + CSM",
                "Dedicated Slack channel"
            ],
            isPro: false,
            ctaText: "Contact Sales"
        }
    ];

    return (
        <section className="pricing-section bg-secondary" id="pricing">
            <div className="container">
                <div className="section-header text-center reveal">
                    <h2>Simple, <span className="text-green">Transparent</span> Pricing</h2>
                    <p className="section-subtitle">Choose the plan that fits your material volume.</p>
                </div>

                <div className="billing-toggle-container reveal delay-1">
                    <span className={`toggle-label ${!isAnnual ? 'active' : ''}`}>Monthly</span>
                    <div className="toggle-switch" onClick={() => setIsAnnual(!isAnnual)}>
                        <div className={`switch-knob ${isAnnual ? 'toggled' : ''}`}></div>
                    </div>
                    <span className={`toggle-label ${isAnnual ? 'active' : ''}`}>
                        Annually <span className="discount-badge">Save 20%</span>
                    </span>
                </div>

                <div className="pricing-grid reveal delay-2">
                    {plans.map((plan, idx) => (
                        <PricingCard
                            key={idx}
                            title={plan.title}
                            price={plan.price}
                            features={plan.features}
                            isPro={plan.isPro}
                            ctaText={plan.ctaText}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
