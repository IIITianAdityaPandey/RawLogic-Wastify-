import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlowButton, OutlineButton } from '../components/ui/Button';
import { auth } from '../firebase/config';
import { getUserProfile, logoutUser } from '../services/authService';
import { getMaterialsByUser, deleteMaterial, updateMaterial } from '../services/materialService';
import { getFollowerCounts } from '../services/userService';
import { subscribeToUserChats } from '../services/chatService';
import './DashboardPage.css';

export const DashboardPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [followerCounts, setFollowerCounts] = useState({ followers: 0, following: 0 });
    const [unreadChats, setUnreadChats] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            window.location.hash = '#/login';
            return;
        }

        let unsubChats = null;

        const fetchData = async () => {
            try {
                // Fetch user profile
                const profile = await getUserProfile(user.uid);
                setUserProfile(profile);

                // Fetch user's own listings only
                const materials = await getMaterialsByUser(user.uid);
                setMyListings(materials);

                // Fetch follower counts
                const counts = await getFollowerCounts(user.uid);
                setFollowerCounts(counts);

                // Subscribe to chats for unread count
                unsubChats = subscribeToUserChats(user.uid, (chats) => {
                    setUnreadChats(chats.length);
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            if (unsubChats) unsubChats();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            window.location.hash = '#/';
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        setDeletingId(id);
        try {
            await deleteMaterial(id);
            setMyListings(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting listing:", error);
            alert("Failed to delete listing.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditFormData({
            name: item.name || '',
            category: item.category || '',
            condition: item.condition || '',
            quantity_estimate: item.quantity_estimate || '',
            price: item.price || '',
            status: item.status || 'Available'
        });
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateMaterial(editingItem.id, editFormData);
            setMyListings(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...editFormData } : item));
            setEditingItem(null);
        } catch (error) {
            console.error("Error updating listing:", error);
            alert("Failed to update listing.");
        } finally {
            setIsSaving(false);
        }
    };

    // Compute real stats from user's own listings
    const totalListings = myListings.length;
    const activeListings = myListings.filter(m => m.status === 'Available').length;
    const categories = [...new Set(myListings.map(m => m.category).filter(Boolean))];
    const memberSince = userProfile?.createdAt
        ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'N/A';

    if (isLoading) {
        return (
            <div className="dashboard-page loading">
                <Navbar />
                <div className="loader-container">
                    <div className="loader"></div>
                    <p>Loading your dashboard...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Navbar />
            
            <main className="container dashboard-container">
                <header className="dashboard-header">
                    <div className="header-info">
                        <h1>Welcome back, <span className="text-green">{userProfile?.name || 'User'}</span></h1>
                        <p className="user-type-badge">{userProfile?.userType || 'Member'}</p>
                        <p className="member-since">Member since {memberSince}</p>
                    </div>
                    <div className="header-actions">
                        <GlowButton href="#/analyze">✨ List New Material</GlowButton>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {/* Stats - all real data */}
                    <section className="dashboard-section stats-grid">
                        <div className="stat-card">
                            <label>Your Listings</label>
                            <h3>{totalListings}</h3>
                            <p className="stat-detail">{activeListings} active</p>
                        </div>
                        <div className="stat-card">
                            <label>Followers</label>
                            <h3>{followerCounts.followers}</h3>
                            <p className="stat-detail">{followerCounts.following} following</p>
                        </div>
                        <div className="stat-card">
                            <label>Conversations</label>
                            <h3>{unreadChats}</h3>
                            <p className="stat-detail">Active chats</p>
                        </div>
                        <div className="stat-card">
                            <label>Categories</label>
                            <h3>{categories.length}</h3>
                            <p className="stat-detail">{categories.slice(0, 3).join(', ') || 'None yet'}</p>
                        </div>
                    </section>

                    {/* Listings - real data from Firebase */}
                    <section className="dashboard-section recent-activity">
                        <div className="section-header">
                            <h2>Your Listings</h2>
                            <a href="#/marketplace" className="view-all">View Marketplace →</a>
                        </div>
                        
                        <div className="listings-list">
                            {myListings.length > 0 ? (
                                myListings.map(item => (
                                    <div className="listing-row" key={item.id}>
                                        <a href={`#/item/${item.id}`} className="listing-img" style={{ backgroundImage: `url(${item.image})`, display: 'block', textDecoration: 'none' }}>
                                            {!item.image && <span className="no-img">📦</span>}
                                        </a>
                                        <div className="listing-info">
                                            <a href={`#/item/${item.id}`} style={{ textDecoration: 'none' }}>
                                                <h4>{item.name || 'Untitled Material'}</h4>
                                            </a>
                                            <p>{item.category || 'Uncategorized'} • {item.condition || 'N/A'} • {item.quantity_estimate || ''}</p>
                                            <p className="listing-date">
                                                {item.createdAt ? item.createdAt.toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                        <div className="listing-status">
                                            <span className={`status-tag ${item.status === 'Available' ? 'active' : 'inactive'}`}>
                                                {item.status || 'Available'}
                                            </span>
                                        </div>
                                        <div className="listing-actions" style={{display: 'flex', gap: '8px'}}>
                                            <button className="icon-btn" onClick={() => handleEditClick(item)}>Edit</button>
                                            <button

                                                className="icon-btn danger"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                            >
                                                {deletingId === item.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>You haven't listed any materials yet.</p>
                                    <OutlineButton href="#/analyze">Create your first listing</OutlineButton>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Sidebar with real links */}
                    <aside className="dashboard-sidebar">
                        <div className="sidebar-card">
                            <h3>Quick Actions</h3>
                            <ul className="action-links">
                                <li><a href="#/analyze">✨ Analyze & List Material</a></li>
                                <li><a href="#/marketplace">Browse Marketplace</a></li>
                                <li><a href="#/community">Explore Community</a></li>
                                <li><a href="#/messages">💬 Your Messages</a></li>
                                <li><a href={`#/user/${auth.currentUser?.uid}`}>👤 Your Public Profile</a></li>
                                <li><a href="#" onClick={handleLogout} style={{ color: 'var(--error)' }}>Sign Out</a></li>
                            </ul>
                        </div>
                        <div className="sidebar-card promo-card">
                            <h3>Sustainability Impact</h3>
                            <p>You've listed <strong>{totalListings}</strong> material{totalListings !== 1 ? 's' : ''} for recycling. Keep diverting waste from landfills!</p>
                            <GlowButton href="#/analyze" className="sm-btn">Add More</GlowButton>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />

            {editingItem && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Listing</h2>
                        <form onSubmit={handleEditSave} className="edit-form">
                            <div className="form-group">
                                <label>Material Name</label>
                                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required className="modal-input" />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input type="text" value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} className="modal-input" placeholder="e.g. $45/ton" />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="text" value={editFormData.quantity_estimate} onChange={(e) => setEditFormData({...editFormData, quantity_estimate: e.target.value})} className="modal-input" />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})} className="modal-input">
                                    <option value="Available">Available</option>
                                    <option value="Sold">Sold</option>
                                    <option value="Hidden">Hidden</option>
                                </select>
                            </div>
                            <div className="modal-actions" style={{display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px'}}>
                                <OutlineButton type="button" onClick={() => setEditingItem(null)}>Cancel</OutlineButton>
                                <GlowButton type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</GlowButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
