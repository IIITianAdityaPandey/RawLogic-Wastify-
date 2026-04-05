import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlowButton, OutlineButton } from '../components/ui/Button';
import { getAllUsers } from '../services/userService';
import './CommunityPage.css';

export const CommunityPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    return (
        <div className="community-page">
            <Navbar />
            
            <header className="community-header">
                <div className="container text-center">
                    <h1>Wastify <span className="text-green">Community</span></h1>
                    <p>Connect with buyers, sellers, and recycling champions.</p>
                </div>
            </header>

            <main className="container community-main">
                {isLoading ? (
                    <div className="loader-container"><div className="loader"></div><p>Loading members...</p></div>
                ) : (
                    <div className="users-grid">
                        {users.map(user => (
                            <div className="user-card" key={user.uid}>
                                <div className="user-avatar-placeholder">
                                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <h3>{user.name}</h3>
                                <p className="user-type">{user.userType || 'Member'}</p>
                                <GlowButton href={`#/user/${user.uid}`} className="sm-btn">View Profile</GlowButton>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div className="empty-state">No users found in the community yet.</div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
