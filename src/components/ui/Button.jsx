import React from 'react';
import './Button.css';

export const GlowButton = ({ children, onClick, href, className = '' }) => {
    if (href) {
        return <a href={href} className={`glow-button ${className}`}>{children}</a>;
    }
    return (
        <button className={`glow-button ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

export const OutlineButton = ({ children, onClick, href, className = '' }) => {
    if (href) {
        return <a href={href} className={`outline-button ${className}`}>{children}</a>;
    }
    return (
        <button className={`outline-button ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};
