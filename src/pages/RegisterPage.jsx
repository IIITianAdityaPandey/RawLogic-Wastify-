import React, { useState } from 'react';
import { GlowButton } from '../components/ui/Button';
import { FormGroup, Input } from '../components/ui/Input';
import { registerUser } from '../services/authService';
import './AuthPages.css';

export const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('seller'); // 'seller' or 'buyer'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await registerUser(name, email, password, userType);
            window.location.hash = '#/marketplace';
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container" style={{ maxWidth: '520px' }}>
                <div className="auth-header">
                    <a href="#/" className="auth-back-link">← Back to Home</a>
                    <div className="auth-logo">
                        <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                            <path d="M12 2L2 7.77778V16.2222L12 22L22 16.2222V7.77778L12 2Z" stroke="var(--green-primary)" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M12 7V17M12 17L8 13M12 17L16 13" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2>Create an Account</h2>
                    <p>Join the future of circular economy.</p>
                </div>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="user-type-toggle" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                        <div
                            className={`type-option ${userType === 'seller' ? 'active' : ''}`}
                            onClick={() => setUserType('seller')}
                            style={{ flex: 1, padding: '12px', textAlign: 'center', border: `1px solid ${userType === 'seller' ? 'var(--green-primary)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: userType === 'seller' ? 'rgba(0, 230, 118, 0.1)' : 'transparent', transition: 'all 0.2s', color: userType === 'seller' ? 'var(--green-primary)' : 'var(--text-primary)' }}
                        >
                            <strong>Seller</strong>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>I have waste</p>
                        </div>
                        <div
                            className={`type-option ${userType === 'buyer' ? 'active' : ''}`}
                            onClick={() => setUserType('buyer')}
                            style={{ flex: 1, padding: '12px', textAlign: 'center', border: `1px solid ${userType === 'buyer' ? 'var(--green-primary)' : 'var(--border)'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: userType === 'buyer' ? 'rgba(0, 230, 118, 0.1)' : 'transparent', transition: 'all 0.2s', color: userType === 'buyer' ? 'var(--green-primary)' : 'var(--text-primary)' }}
                        >
                            <strong>Buyer</strong>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>I need materials</p>
                        </div>
                    </div>

                    <FormGroup label="Full Name / Company Name">
                        <Input
                            type="text"
                            placeholder="Acme Corp"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <FormGroup label="Email Address">
                        <Input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <FormGroup label="Password">
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>

                    {error && <p className="error-msg" style={{color: 'var(--error)', marginBottom: '16px', fontSize: '0.9rem'}}>{error}</p>}
                    <GlowButton 
                        className="auth-submit-btn" 
                        style={{ marginTop: '16px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </GlowButton>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <a href="#/login" className="text-green">Sign in</a></p>
                </div>
            </div>

            <div className="auth-background">
                <div className="orb orb-1"></div>
                <div className="orb orb-2" style={{ left: '80%', top: '20%' }}></div>
            </div>
        </div>
    );
};
