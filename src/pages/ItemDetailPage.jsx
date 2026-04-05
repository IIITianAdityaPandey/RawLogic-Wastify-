import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlowButton, OutlineButton } from '../components/ui/Button';
import { auth } from '../firebase/config';
import { getMaterialById, getAllMaterials } from '../services/materialService';
import { getUserProfile } from '../services/authService';
import { createOrGetChat } from '../services/chatService';
import './ItemDetailPage.css';

export const ItemDetailPage = ({ itemId }) => {
    const [item, setItem] = useState(null);
    const [seller, setSeller] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [contacting, setContacting] = useState(false);
    const [suggestedItems, setSuggestedItems] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchItemData = async () => {
            setIsLoading(true);
            try {
                const fetchedItem = await getMaterialById(itemId);
                if (fetchedItem) {
                    setItem(fetchedItem);
                    if (fetchedItem.userId) {
                        const sellerProfile = await getUserProfile(fetchedItem.userId);
                        setSeller(sellerProfile);
                    }

                    // Fetch suggested items in the same category
                    if (fetchedItem.category) {
                        try {
                            const allItems = await getAllMaterials(fetchedItem.category);
                            // Filter out the current item and limit to 4
                            const related = allItems.filter(i => i.id !== itemId).slice(0, 4);
                            setSuggestedItems(related);
                        } catch (err) {
                            console.error("Failed to fetch suggestions");
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching item details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (itemId) {
            fetchItemData();
        }
    }, [itemId]);

    const handleContact = async () => {
        if (!auth.currentUser) {
            window.location.hash = '#/login';
            return;
        }

        if (item.userId === auth.currentUser.uid) {
            alert("This is your own listing!");
            return;
        }

        if (!item.userId) {
            alert("Unable to contact the seller. Listing has no owner info.");
            return;
        }

        setContacting(true);
        try {
            const chat = await createOrGetChat(auth.currentUser.uid, item.userId);
            window.location.hash = `#/messages/${chat.id}`;
        } catch (error) {
            console.error("Error starting chat:", error);
            alert("Could not start chat. Please try again.");
            setContacting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="item-detail-page loading">
                <Navbar />
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Loading item details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="item-detail-page not-found">
                <Navbar />
                <div className="empty-state" style={{ marginTop: '100px' }}>
                    <h2>Item Not Found</h2>
                    <p>The material you're looking for may have been removed or doesn't exist.</p>
                    <OutlineButton href="#/marketplace" style={{ marginTop: '20px' }}>Back to Marketplace</OutlineButton>
                </div>
                <Footer />
            </div>
        );
    }

    const isOwnListing = auth.currentUser && item.userId === auth.currentUser.uid;

    return (
        <div className="item-detail-page">
            <Navbar />

            <main className="container detail-container">
                {/* Top Nav Back Link */}
                <div className="detail-breadcrumb">
                    <a href="#/marketplace" className="back-link">← Back to Marketplace</a>
                </div>

                <div className="detail-grid">
                    {/* Left Side: Images & Info */}
                    <div className="detail-main-content">
                        <div className="detail-image-box">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="detail-hero-image" />
                            ) : (
                                <div className="detail-no-image">📦 No Image Available</div>
                            )}
                            <span className="detail-category-badge">{item.category || 'Uncategorized'}</span>
                        </div>

                        <div className="detail-description-box">
                            <h2>Description</h2>
                            <p className="detail-description">
                                {item.description || 'No detailed description provided by the seller.'}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Specs & Action Card */}
                    <div className="detail-sidebar">
                        <div className="action-card">
                            <h1 className="detail-title">{item.name || 'Untitled Material'}</h1>
                            <div className="detail-price-box">
                                <span className="price-label">Price / Rate</span>
                                <div className="price-value">{item.price || 'Contact for Pricing'}</div>
                            </div>

                            <div className="spec-list">
                                <div className="spec-item">
                                    <span className="spec-label">Quantity</span>
                                    <span className="spec-value">{item.quantity_estimate || item.quantity || 'Not specified'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Condition</span>
                                    <span className="spec-value">{item.condition || 'Not specified'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Purity</span>
                                    <span className="spec-value">{item.purity || 'Not specified'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Location</span>
                                    <span className="spec-value">📍 {item.location || 'Remote/Unknown'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Status</span>
                                    <span className={`status-tag ${item.status === 'Available' ? 'active' : 'inactive'}`}>
                                        {item.status || 'Available'}
                                    </span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Listed</span>
                                    <span className="spec-value">{item.createdAt ? item.createdAt.toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="detail-actions">
                                {isOwnListing ? (
                                    <GlowButton href="#/dashboard" style={{ width: '100%', textAlign: 'center' }}>
                                        Manage in Dashboard
                                    </GlowButton>
                                ) : (
                                    <GlowButton onClick={handleContact} disabled={contacting} style={{ width: '100%', textAlign: 'center' }}>
                                        {contacting ? 'Starting Chat...' : '💬 Contact Seller'}
                                    </GlowButton>
                                )}
                            </div>
                        </div>

                        {seller && (
                            <div className="seller-card">
                                <h3>About the Seller</h3>
                                <div className="seller-info">
                                    <div className="seller-avatar">
                                        {seller.name ? seller.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="seller-details">
                                        <h4>{seller.name}</h4>
                                        <p>{seller.userType || 'Member'}</p>
                                    </div>
                                </div>
                                <OutlineButton href={`#/user/${item.userId}`} style={{ width: '100%', marginTop: '15px', textAlign: 'center' }}>
                                    View Full Profile
                                </OutlineButton>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Suggested Items Section */}
                {suggestedItems.length > 0 && (
                    <div className="suggested-items-section" style={{ marginTop: '80px' }}>
                        <h2 className="section-title" style={{ fontSize: '1.8rem', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '30px' }}>
                            More like this
                        </h2>
                        <div className="marketplace-grid">
                            {suggestedItems.map(suggested => (
                                <div className="marketplace-card" key={suggested.id}>
                                    <a href={`#/item/${suggested.id}`} className="marketplace-card-img" style={{ backgroundImage: `url(${suggested.image})`, display: 'block', textDecoration: 'none' }}>
                                        <span className="marketplace-badge">{suggested.category}</span>
                                    </a>
                                    <div className="marketplace-card-body">
                                        <a href={`#/item/${suggested.id}`} style={{ textDecoration: 'none' }}>
                                            <h3 className="item-name">{suggested.name}</h3>
                                        </a>
                                        <p className="item-location">📍 {suggested.location || 'Remote'}</p>
                                        <div className="item-specs">
                                            <div className="spec"><span>Qty:</span> <strong>{suggested.quantity_estimate || 'N/A'}</strong></div>
                                            <div className="spec"><span>Cond:</span> <strong>{suggested.condition || 'N/A'}</strong></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
