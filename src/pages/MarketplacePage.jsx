import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlowButton, OutlineButton } from '../components/ui/Button';
import { getAllMaterials } from '../services/materialService';
import { auth } from '../firebase/config';
import { createOrGetChat } from '../services/chatService';
import './MarketplacePage.css';

// Demo data removed, fetching directly from Firestore

const CATEGORIES = ["All", "Metal", "Plastic", "E-Waste", "Glass", "Paper", "Textile", "Organic", "Wood", "Rubber", "Ceramic", "Chemical", "Composite", "Other"];

export const MarketplacePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [contactingId, setContactingId] = useState(null);

    React.useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const firestoreItems = await getAllMaterials(selectedCategory);
                setItems(firestoreItems);
            } catch (error) {
                console.error("Error fetching materials:", error);
                setItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [selectedCategory]);

    const handleContact = async (item) => {
        if (!auth.currentUser) {
            window.location.hash = '#/login';
            return;
        }

        // Don't let users message themselves
        if (item.userId === auth.currentUser.uid) {
            alert("This is your own listing!");
            return;
        }

        if (!item.userId) {
            alert("Unable to contact the seller. Listing has no owner info.");
            return;
        }

        setContactingId(item.id);
        try {
            const chat = await createOrGetChat(auth.currentUser.uid, item.userId);
            window.location.hash = `#/messages/${chat.id}`;
        } catch (error) {
            console.error("Error starting chat:", error);
            alert("Could not start chat. Please try again.");
        } finally {
            setContactingId(null);
        }
    };

    const filteredItems = items.filter(item => {
        const name = item.name || '';
        const location = item.location || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="marketplace-page">
            <Navbar />

            <header className="marketplace-header">
                <div className="marketplace-header-inner">
                    <h1>Material <span className="text-green">Marketplace</span></h1>
                    <p>Source high-quality recycled materials or list your industrial byproducts directly to manufacturers.</p>
                </div>
            </header>

            <div className="marketplace-layout">
                {/* Sidebar Filters */}
                <aside className="marketplace-sidebar">
                    <div className="filter-group">
                        <h3>Search</h3>
                        <input
                            type="text"
                            className="marketplace-search-input"
                            placeholder="Search materials, locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <h3>Categories</h3>
                        <ul className="category-list">
                            {CATEGORIES.map(cat => (
                                <li key={cat}>
                                    <button
                                        className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content Grid */}
                <main className="marketplace-content">
                    <div className="marketplace-results-bar">
                        <p>Showing <strong>{filteredItems.length}</strong> items for "{selectedCategory}"</p>
                        {isLoading && <span className="text-green" style={{marginLeft: '15px'}}>Refreshing...</span>}
                        <select className="marketplace-sort">
                            <option>Newest First</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Distance</option>
                        </select>
                    </div>

                    {filteredItems.length > 0 ? (
                        <div className="marketplace-grid">
                            {filteredItems.map(item => (
                                <div className="marketplace-card" key={item.id}>
                                    <a href={`#/item/${item.id}`} className="marketplace-card-img" style={{ backgroundImage: `url(${item.image})`, display: 'block', textDecoration: 'none' }}>
                                        <span className="marketplace-badge">{item.category}</span>
                                    </a>
                                    <div className="marketplace-card-body">
                                        <a href={`#/item/${item.id}`} style={{ textDecoration: 'none' }}>
                                            <h3 className="item-name">{item.name}</h3>
                                        </a>
                                        <p className="item-location">📍 {item.location || 'Remote'}</p>

                                        <div className="item-specs">
                                            <div className="spec"><span>Qty:</span> <strong>{item.quantity_estimate || item.quantity || 'N/A'}</strong></div>
                                            <div className="spec"><span>Purity:</span> <strong>{item.purity || 'N/A'}</strong></div>
                                            <div className="spec"><span>Cond:</span> <strong>{item.condition || 'N/A'}</strong></div>
                                        </div>

                                        <div className="item-footer">
                                            <div className="item-price">{item.price || 'Contact for pricing'}</div>
                                            {item.userId && item.userId !== auth.currentUser?.uid ? (
                                                <GlowButton
                                                    className="sm-btn"
                                                    onClick={() => handleContact(item)}
                                                    disabled={contactingId === item.id}
                                                >
                                                    {contactingId === item.id ? '...' : '💬 Contact'}
                                                </GlowButton>
                                            ) : item.userId === auth.currentUser?.uid ? (
                                                <span className="own-listing-tag">Your Listing</span>
                                            ) : (
                                                <GlowButton className="sm-btn" href="#/login">💬 Contact</GlowButton>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="marketplace-empty">
                            <h3>No items found</h3>
                            <p>Try adjusting your search criteria or modifying filters.</p>
                            <OutlineButton onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>
                                Clear Filters
                            </OutlineButton>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};
