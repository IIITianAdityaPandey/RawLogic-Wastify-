import React from 'react';
import './Footer.css';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">

                    <div className="footer-brand">
                        <a href="#" className="brand">
                            <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7.77778V16.2222L12 22L22 16.2222V7.77778L12 2Z" stroke="var(--green-primary)" strokeWidth="2" strokeLinejoin="round" />
                                <path d="M12 7V17M12 17L8 13M12 17L16 13" stroke="var(--green-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="brand-text">Wastify</span>
                        </a>
                        <p className="tagline">AI Waste Intelligence Platform</p>
                        <div className="social-links">
                            <a href="#" aria-label="Twitter">𝕏</a>
                            <a href="#" aria-label="LinkedIn">in</a>
                            <a href="#" aria-label="GitHub">gh</a>
                            <a href="#" aria-label="YouTube">yt</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Pricing</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About</a></li>
                            <li><a href="#/blog">Blog</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                            <li><a href="#">Cancellation & Refunds</a></li>
                            <li><a href="#">Shipping Policy</a></li>
                        </ul>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>© 2026 Wastify. All rights reserved.</p>
                    <p>Made for a circular economy 🌱</p>
                </div>
            </div>
        </footer>
    );
};
