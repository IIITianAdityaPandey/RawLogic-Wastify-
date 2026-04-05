import React, { useEffect, useMemo } from 'react';
import './BlogDetailPage.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlowButton } from '../components/ui/Button';
import { BLOG_POSTS } from './BlogPage';

export const BlogDetailPage = ({ id }) => {
    // Find the current post
    const post = useMemo(() => 
        BLOG_POSTS.find(p => p.id === parseInt(id)) || BLOG_POSTS[0], 
    [id]);

    // Get 3 related posts (shuffle or pick others)
    const relatedPosts = useMemo(() => 
        BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3),
    [post.id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [id]);

    return (
        <div className="blog-detail-page">
            <Navbar />
            
            <a href="#/blog" className="back-btn">
                ← Back to Blog
            </a>

            <main>
                <article>
                    <header className="blog-detail-hero container reveal">
                        <div className="blog-detail-meta">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                        </div>
                        <h1>{post.title}</h1>
                        <div className="author-meta">
                            <div className="author-circle">
                                {post.author.charAt(0)}
                            </div>
                            <div className="author-name-detail">
                                <strong>{post.author}</strong>
                                <span>Published in Wastify Insights</span>
                            </div>
                        </div>
                    </header>

                    <div className="blog-detail-image container reveal delay-1">
                        <img src={post.image} alt={post.title} />
                    </div>

                    <div className="blog-detail-content container reveal delay-2">
                        <p>{post.excerpt}</p>
                        <p>
                            In the rapidly evolving landscape of the circular economy, the integration of 
                            cutting-edge technology is no longer optional—it's a necessity. Companies that 
                            leverage data to optimize their resource management are seeing unprecedented 
                            gains in both efficiency and sustainability.
                        </p>
                        <h2>The Paradigm Shift</h2>
                        <p>
                            For decades, the "take-make-waste" model dominated global industry. However, 
                            resource scarcity and environmental pressures have forced a fundamental rethink. 
                            The circular economy offers a viable solution by decoupling economic growth from 
                            finite resource consumption.
                        </p>
                        <p>
                            At Wastify, we've seen firsthand how AI can transform these abstract concepts into 
                            tangible results. By predicting waste generation patterns and optimizing 
                            logistics, businesses can reduce their carbon footprint while simultaneously 
                            improving their bottom line.
                        </p>
                        <h2>Key Strategic Pillars</h2>
                        <p>
                            To build a truly sustainable future, we must focus on three core pillars: 
                            traceability, connectivity, and intelligence. Without clear data on where 
                            materials come from and where they go, circularity remains a pipe dream.
                        </p>
                        <p>
                            As we look toward 2030, the vision is clear: a world where waste is designed out 
                            of the system entirely, and every material is treated as a valuable asset for the 
                            next cycle.
                        </p>
                    </div>
                </article>

                <section className="related-posts">
                    <div className="container">
                        <h2 className="reveal">Continue Reading</h2>
                        <div className="related-grid">
                            {relatedPosts.map((rPost, index) => (
                                <article key={rPost.id} className={`blog-card reveal delay-${index + 1}`}>
                                    <div className="blog-image">
                                        <img src={rPost.image} alt={rPost.title} />
                                    </div>
                                    <div className="blog-content">
                                        <span className="blog-tag">{rPost.category}</span>
                                        <h3 className="blog-title" style={{fontSize: '1.2rem', marginBottom: '16px'}}>{rPost.title}</h3>
                                        <div className="blog-footer">
                                            <a href={`#/blog/${rPost.id}`} className="text-green">Read More →</a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
