import React, { useState } from 'react';
import { GlowButton } from '../components/ui/Button';
import { FormGroup, Input } from '../components/ui/Input';
import { loginUser } from '../services/authService';
import './AuthPages.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await loginUser(email, password);
            window.location.hash = '#/marketplace';
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <a href="#/" className="auth-back-link">← Back to Home</a>
                    <div className="auth-logo">
                        <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                            <path d="M12 2L2 7.77778V16.2222L12 22L22 16.2222V7.77778L12 2Z" stroke="var(--green-primary)" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M12 7V17M12 17L8 13M12 17L16 13" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Enter your details to access your dashboard.</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
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

                    <div className="auth-options">
                        <label className="checkbox-container">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#/forgot-password" className="forgot-password">Forgot Password?</a>
                    </div>


                    {error && <p className="error-msg" style={{color: 'var(--error)', marginBottom: '16px', fontSize: '0.9rem'}}>{error}</p>}
                    <GlowButton 
                        className="auth-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </GlowButton>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <a href="#/register" className="text-green">Sign up</a></p>
                </div>
            </div>

            <div className="auth-background">
                <div className="orb orb-1"></div>
                <div className="orb orb-3"></div>
            </div>
        </div>
    );
};
