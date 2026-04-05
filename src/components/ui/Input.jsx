import React from 'react';
import './Input.css';

export const FormGroup = ({ label, children, error }) => (
    <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        {children}
        {error && <span className="form-error">{error}</span>}
    </div>
);

export const Input = ({ type = 'text', placeholder, value, onChange, required, icon }) => {
    return (
        <div className="input-wrapper">
            {icon && <div className="input-icon">{icon}</div>}
            <input
                type={type}
                className={`glow-input ${icon ? 'with-icon' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};
