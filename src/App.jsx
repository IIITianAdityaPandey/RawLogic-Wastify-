import React, { useState, useEffect } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { DashboardPage } from './pages/DashboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { ItemDetailPage } from './pages/ItemDetailPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo(0, 0); // Reset scroll on page change
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Hash Router
  if (currentPath === '#/login') {
    return <LoginPage />;
  }

  if (currentPath === '#/register') {
    return <RegisterPage />;
  }

  if (currentPath === '#/marketplace') {
    return <MarketplacePage />;
  }

  if (currentPath === '#/blog') {
    return <BlogPage />;
  }

  if (currentPath.startsWith('#/blog/')) {
    const postId = currentPath.split('/').pop();
    return <BlogDetailPage id={postId} />;
  }

  if (currentPath === '#/analyze') {
    return <AnalyzePage />;
  }

  if (currentPath === '#/dashboard') {
    return <DashboardPage />;
  }

  if (currentPath === '#/community') {
    return <CommunityPage />;
  }

  if (currentPath.startsWith('#/user/')) {
    const userId = currentPath.split('/').pop();
    return <PublicProfilePage userId={userId} />;
  }

  if (currentPath === '#/messages') {
    return <MessagesPage />;
  }

  if (currentPath.startsWith('#/messages/')) {
    const chatId = currentPath.split('/').pop();
    return <MessagesPage activeChatId={chatId} />;
  }

  if (currentPath.startsWith('#/item/')) {
    const itemId = currentPath.split('/').pop();
    return <ItemDetailPage itemId={itemId} />;
  }

  return <LandingPage />;
}

export default App;
