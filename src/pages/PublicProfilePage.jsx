import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlowButton, OutlineButton } from '../components/ui/Button';
import { auth } from '../firebase/config';
import { getUserProfile } from '../services/authService';
import { checkIsFollowing, toggleFollow, getFollowerCounts } from '../services/userService';
import { getMaterialsByUser } from '../services/materialService';
import { createOrGetChat } from '../services/chatService';
import './PublicProfilePage.css';
import '../pages/MarketplacePage.css'; // Reuse marketplace card styles

export const PublicProfilePage = ({ userId }) => {
    const [profile, setProfile] = useState(null);
    const [listings, setListings] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setLoggedInUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const userProfile = await getUserProfile(userId);
                setProfile({ ...userProfile, uid: userId });

                const userListings = await getMaterialsByUser(userId);
                setListings(userListings);

                const counts = await getFollowerCounts(userId);
                setFollowCounts(counts);

                if (auth.currentUser) {
                    const following = await checkIsFollowing(auth.currentUser.uid, userId);
                    setIsFollowing(following);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) fetchProfileData();
    }, [userId, loggedInUser]); // Re-run if logged in user changes

    const handleFollow = async () => {
        if (!loggedInUser) {
            window.location.hash = '#/login';
            return;
        }
        try {
            const nowFollowing = await toggleFollow(loggedInUser.uid, userId);
            setIsFollowing(nowFollowing);
            setFollowCounts(prev => ({
                ...prev,
                followers: nowFollowing ? prev.followers + 1 : prev.followers - 1
            }));
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    const handleMessage = async () => {
        if (!loggedInUser) {
            window.location.hash = '#/login';
            return;
        }
        try {
            const chat = await createOrGetChat(loggedInUser.uid, userId);
            window.location.hash = `#/messages/${chat.id}`;
        } catch (error) {
            console.error("Error starting chat:", error);
            alert("Could not start chat. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="profile-page loading">
                <Navbar />
                <div className="loader-container"><div className="loader"></div><p>Loading profile...</p></div>
                <Footer />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <Navbar />
                <div className="empty-state" style={{marginTop: '100px'}}><h2>User not found.</h2></div>
                <Footer />
            </div>
        );
    }

    const isOwnProfile = loggedInUser && loggedInUser.uid === userId;

    return (
        <div className="profile-page">
            <Navbar />
            
            <header className="profile-header">
                <div className="container profile-header-inner">
                    <div className="profile-avatar">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="profile-info">
                        <h1>{profile.name}</h1>
                        <p className="profile-type">{profile.userType || 'Member'}</p>
                        <div className="profile-stats">
                            <span><strong>{listings.length}</strong> Listings</span>
                            <span><strong>{followCounts.followers}</strong> Followers</span>
                            <span><strong>{followCounts.following}</strong> Following</span>
                        </div>
                    </div>
                    <div className="profile-actions">
                        {!isOwnProfile && (
                            <>
                                <OutlineButton onClick={handleFollow} className={isFollowing ? 'following-btn' : ''}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </OutlineButton>
                                <GlowButton onClick={handleMessage}>Message</GlowButton>
                            </>
                        )}
                        {isOwnProfile && (
                            <OutlineButton href="#/settings">Edit Profile</OutlineButton>
                        )}
                    </div>
                </div>
            </header>

            <main className="container profile-main">
                <h2 className="section-title">Active Listings</h2>
                
                {listings.length > 0 ? (
                    <div className="marketplace-grid" style={{ marginTop: '30px' }}>
                        {listings.map(item => (
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
                                        <div className="spec"><span>Qty:</span> <strong>{item.quantity_estimate || 'N/A'}</strong></div>
                                        <div className="spec"><span>Cond:</span> <strong>{item.condition || 'N/A'}</strong></div>
                                    </div>
                                    <div className="item-footer">
                                        <div className="item-price">Contact for pricing</div>
                                        {!isOwnProfile && (
                                            <GlowButton className="sm-btn" onClick={handleMessage}>💬 Contact</GlowButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>This user hasn't posted any materials yet.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
