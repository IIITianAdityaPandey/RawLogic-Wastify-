import React from 'react';
import { MaterialTag } from '../ui/Badge';
import './MaterialCategoriesSection.css';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const MaterialCategoriesSection = () => {
    const categories = [
        { type: 'Metal', emoji: '♻️', label: 'Metal' },
        { type: 'Plastic', emoji: '🧴', label: 'Plastic' },
        { type: 'E-Waste', emoji: '💻', label: 'E-Waste' },
        { type: 'Glass', emoji: '🪟', label: 'Glass' },
        { type: 'Paper', emoji: '📄', label: 'Paper' },
        { type: 'Textile', emoji: '👕', label: 'Textile' },
        { type: 'Organic', emoji: '🌿', label: 'Organic' },
        { type: 'Wood', emoji: '🪵', label: 'Wood' },
        { type: 'Rubber', emoji: '🔩', label: 'Rubber' },
        { type: 'Ceramic', emoji: '🏺', label: 'Ceramic' },
        { type: 'Chemical', emoji: '⚗️', label: 'Chemical' },
        { type: 'Composite', emoji: '🧱', label: 'Composite' }
    ];

    return (
        <section className="categories-section container" id="categories">
            <div className="section-header text-center reveal">
                <h2><AnimatedNumber target={12} /> Material Categories.<br />Every Type of <span className="text-green">Waste.</span></h2>
                <p className="section-subtitle">Our AI model is pre-trained to recognize over <AnimatedNumber target={5000} prefix="" suffix="+" /> specific items across <AnimatedNumber target={12} /> primary commodity types.</p>
            </div>

            <div className="categories-grid reveal delay-1">
                {categories.map((cat, idx) => (
                    <div key={idx} className={`category-card type-bg-${cat.type.toLowerCase()}`}>
                        <div className="category-emoji">{cat.emoji}</div>
                        <MaterialTag type={cat.type.replace('-', '')} label={cat.label} />
                    </div>
                ))}
            </div>
        </section>
    );
};
