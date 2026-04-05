import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { auth } from '../firebase/config';
import { subscribeToUserChats, subscribeToMessages, sendMessage } from '../services/chatService';
import { getUserProfile } from '../services/authService';
import './MessagesPage.css';

export const MessagesPage = ({ activeChatId = null }) => {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(activeChatId);
    const [newMessage, setNewMessage] = useState('');
    const [chatUsersInfo, setChatUsersInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Initial load: Subscribe to all chats for the logged in user
    useEffect(() => {
        if (!auth.currentUser) {
            window.location.hash = '#/login';
            return;
        }

        const unsubscribe = subscribeToUserChats(auth.currentUser.uid, async (chatList) => {
            setChats(chatList);
            
            // Fetch profiles for the other participants
            const profiles = { ...chatUsersInfo };
            for (const chat of chatList) {
                const otherUserId = chat.participants.find(id => id !== auth.currentUser.uid);
                if (otherUserId && !profiles[otherUserId]) {
                    const profile = await getUserProfile(otherUserId);
                    if (profile) profiles[otherUserId] = profile;
                }
            }
            setChatUsersInfo(profiles);
            setIsLoading(false);
            
            // If no active chat is selected but chats exist, select the first one
            if (!currentChatId && chatList.length > 0 && !activeChatId) {
                setCurrentChatId(chatList[0].id);
            }
        });

        return () => unsubscribe();
    }, []);

    // Subscribe to messages when a chat is selected
    useEffect(() => {
        if (!currentChatId) return;

        const unsubscribe = subscribeToMessages(currentChatId, (msgs) => {
            setMessages(msgs);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [currentChatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChatId || !auth.currentUser) return;

        const text = newMessage;
        setNewMessage(''); // optimistic clear
        
        try {
            await sendMessage(currentChatId, text, auth.currentUser.uid);
        } catch (error) {
            console.error("Failed to send message:", error);
            setNewMessage(text); // revert if failed
        }
    };

    if (isLoading) {
        return (
            <div className="messages-page loading">
                <Navbar />
                <div className="loader-container"><div className="loader"></div><p>Loading messages...</p></div>
            </div>
        );
    }

    return (
        <div className="messages-page">
            <Navbar />
            
            <main className="messages-container">
                {/* Left Sidebar - Chat List */}
                <aside className="chat-sidebar">
                    <div className="sidebar-header">
                        <h2>Inbox</h2>
                    </div>
                    <div className="chat-list">
                        {chats.length === 0 ? (
                            <div className="empty-state-sm">No active conversations.</div>
                        ) : (
                            chats.map(chat => {
                                const otherUserId = chat.participants.find(id => id !== auth.currentUser?.uid);
                                const otherUser = chatUsersInfo[otherUserId];
                                
                                return (
                                    <div 
                                        key={chat.id} 
                                        className={`chat-list-item ${currentChatId === chat.id ? 'active' : ''}`}
                                        onClick={() => setCurrentChatId(chat.id)}
                                    >
                                        <div className="chat-avatar">
                                            {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div className="chat-preview">
                                            <h4>{otherUser?.name || 'Unknown User'}</h4>
                                            <p className="last-message">{chat.lastMessage || 'Start a conversation...'}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Right Area - Chat Window */}
                <section className="chat-window">
                    {!currentChatId ? (
                        <div className="empty-chat-state">
                            Select a conversation from the left to start messaging.
                        </div>
                    ) : (
                        <>
                            <div className="chat-header">
                                {(() => {
                                    const chat = chats.find(c => c.id === currentChatId);
                                    if (!chat) return <h3>Loading...</h3>;
                                    const otherUserId = chat.participants.find(id => id !== auth.currentUser?.uid);
                                    const otherUser = chatUsersInfo[otherUserId];
                                    return (
                                        <>
                                            <div className="chat-avatar sm">
                                                {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <h3>{otherUser?.name || 'User'}</h3>
                                            <a href={`#/user/${otherUserId}`} className="view-profile-link">View Profile</a>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="messages-list">
                                {messages.length === 0 ? (
                                    <div className="empty-state-sm" style={{marginTop: 'auto', marginBottom: '20px'}}>
                                        Send a message to start the conversation!
                                    </div>
                                ) : (
                                    messages.map(msg => {
                                        const isMine = msg.senderId === auth.currentUser?.uid;
                                        return (
                                            <div key={msg.id} className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                                                <p>{msg.text}</p>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                                    Send
                                </button>
                            </form>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};
