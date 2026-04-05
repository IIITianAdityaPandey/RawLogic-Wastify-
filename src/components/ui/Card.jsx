import React from 'react';
import './Card.css';

export const FeatureCard = ({ icon, title, description, className = '' }) => {
    return (
        <div className={`feature-card ${className}`}>
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
};

export const PricingCard = ({ title, price, features, isPro, ctaText, className = '' }) => {
    return (
        <div className={`pricing-card ${isPro ? 'pro-tier' : ''} ${className}`}>
            {isPro && <div className="popular-badge">Most Popular</div>}
            <h3 className="pricing-title text-primary">{title}</h3>
            <div className="pricing-price">{price}</div>
            <ul className="pricing-features">
                {features.map((feature, idx) => (
                    <li key={idx}><span className="check">✓</span> {feature}</li>
                ))}
            </ul>
            <button className={isPro ? 'pricing-btn btn-primary' : 'pricing-btn btn-outline'}>
                {ctaText}
            </button>
        </div>
    );
};

export const TestimonialCard = ({ quote, name, role, initials, className = '' }) => {
    return (
        <div className={`testimonial-card ${className}`}>
            <p className="testimonial-quote">"{quote}"</p>
            <div className="testimonial-author">
                <div className="avatar-circle">{initials}</div>
                <div className="author-info">
                    <p className="author-name">{name}</p>
                    <p className="author-role">{role}</p>
                </div>
            </div>
            <div className="star-rating">
                {[...Array(5)].map((_, i) => <span key={i} className="star">★</span>)}
            </div>
        </div>
    );
};
