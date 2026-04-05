import React from 'react';
import './Badge.css';

export const StatBadge = ({ value, label, className = '' }) => {
    return (
        <div className={`stat-badge ${className}`}>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

export const MaterialTag = ({ type, label, className = '' }) => {
    return (
        <span className={`material-tag type-${type.toLowerCase()} ${className}`}>
            {label}
        </span>
    );
};
