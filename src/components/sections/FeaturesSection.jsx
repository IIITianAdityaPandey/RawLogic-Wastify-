import React from 'react';
import { FeatureCard } from '../ui/Card';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import './FeaturesSection.css';

export const FeaturesSection = () => {
    const features = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            ),
            title: "AI Vision Classification",
            description: <>YOLOv8 + custom CNN trained on <AnimatedNumber target={500} suffix="K+" /> waste images. <AnimatedNumber target={12} /> material categories. <AnimatedNumber target={92} suffix="%+" /> accuracy.</>
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
            ),
            title: "Smart Segregation Dashboard",
            description: "Visual inventory grid. Auto market value estimates from live commodity prices. QR code label generation per lot."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                </svg>
            ),
            title: "Intelligent Buyer Matching",
            description: <>Vector embedding similarity matching. Geo-aware radius filters. Match scores 0–<AnimatedNumber target={100} />. Instant multi-channel notifications.</>
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            ),
            title: "Marketplace & Transactions",
            description: "Fixed price, best offer, and timed auctions. Integrated messaging. Escrow payments. GST-compliant invoices."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            ),
            title: "Analytics & Reporting",
            description: "Revenue, match rates, CO₂ saved, procurement trends. Downloadable PDF/Excel reports. Webhook support for BI."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
            ),
            title: "API & Enterprise",
            description: <>Full REST API. Batch classification (<AnimatedNumber target={1000} /> images/request). White-label for municipalities and aggregators.</>
        }
    ];

    return (
        <section className="features-section bg-secondary" id="features">
            <div className="container">
                <div className="section-header text-center reveal">
                    <h2>What <span className="text-green">Wastify</span> Does For You</h2>
                    <p className="section-subtitle">Everything you need to turn waste streams into revenue streams.</p>
                </div>

                <div className="features-grid reveal delay-1">
                    {features.map((feat, idx) => (
                        <FeatureCard
                            key={idx}
                            icon={feat.icon}
                            title={feat.title}
                            description={feat.description}
                        />
                    ))}
                </div>

                <div className="comparison-container reveal delay-2">
                    <h3>The Wastify Advantage</h3>
                    <div className="table-responsive">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Topic</th>
                                    <th>Traditional Approach</th>
                                    <th className="highlight-col">Wastify</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Waste Classification</td>
                                    <td>Manual, <AnimatedNumber target={20} suffix="%+" /> error rate</td>
                                    <td className="highlight-col">AI-powered, {'>'}<AnimatedNumber target={92} suffix="%" /> accuracy</td>
                                </tr>
                                <tr>
                                    <td>Buyer Discovery</td>
                                    <td>No platform, siloed networks</td>
                                    <td className="highlight-col">Intelligent matching engine</td>
                                </tr>
                                <tr>
                                    <td>Time to Match</td>
                                    <td>Days or never</td>
                                    <td className="highlight-col"><AnimatedNumber target={30} prefix="< " suffix=" seconds" /></td>
                                </tr>
                                <tr>
                                    <td>Market Visibility</td>
                                    <td>None</td>
                                    <td className="highlight-col">Live commodity price estimates</td>
                                </tr>
                                <tr>
                                    <td>Traceability</td>
                                    <td>Paper-based</td>
                                    <td className="highlight-col">QR codes + digital audit trail</td>
                                </tr>
                                <tr>
                                    <td>Scale</td>
                                    <td>Per-city, fragmented</td>
                                    <td className="highlight-col">National → International</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};
