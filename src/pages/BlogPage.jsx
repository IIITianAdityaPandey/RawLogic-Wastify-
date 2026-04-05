import React, { useState, useEffect } from 'react';
import './BlogPage.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlowButton } from '../components/ui/Button';
import featuredImage from '../assets/blog/featured.png';

// Exporting mock data to reuse in Detail Page
export const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of Sustainable Logistics: AI and the 2030 Vision",
    excerpt: "Discover how artificial intelligence is revolutionizing the circular economy by optimizing waste collection routes and predicting waste generation patterns.",
    category: "Technology",
    author: "Elena Rodriguez",
    date: "March 28, 2024",
    image: featuredImage,
    isFeatured: true
  },
  {
    id: 2,
    title: "Circular Economy: Why It Matters More Than Ever in 2024",
    excerpt: "Resource scarcity is driving a massive shift toward circularity. We explore the economic benefits of keeping materials in the loop.",
    category: "Sustainability",
    author: "Marcus Thorne",
    date: "March 25, 2024",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
    isFeatured: false
  },
  {
    id: 3,
    title: "Blockchain for Material Traceability: A Game Changer",
    excerpt: "How distributed ledger technology is providing the transparency needed to verify recycled content and material origins in global supply chains.",
    category: "Tech",
    author: "Sarah Chen",
    date: "March 20, 2024",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    isFeatured: false
  },
  {
    id: 4,
    title: "Zero-Waste Manufacturing: Lessons from Leading Factories",
    excerpt: "What top manufacturers are doing to eliminate industrial waste and how your business can implement these strategies today.",
    category: "Industry",
    author: "James Wilson",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=800",
    isFeatured: false
  },
  {
    id: 5,
    title: "The Psychology of Recycling: Why We Do (or Don't) Sort",
    excerpt: "Behavioral science reveals surprising insights into how we can nudge communities toward better waste management habits.",
    category: "Community",
    author: "Dr. Amara Okafor",
    date: "March 10, 2024",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    isFeatured: false
  },
  {
    id: 6,
    title: "Top 5 Innovations in Plastic Recycling for 2024",
    excerpt: "From chemical recycling to enzymatic breakdown, we look at the breakthrough technologies tackling the plastic crisis.",
    category: "Innovation",
    author: "Leo Schmidt",
    date: "March 05, 2024",
    image: "https://images.unsplash.com/photo-1591193022659-dc836886c5e5?auto=format&fit=crop&q=80&w=800",
    isFeatured: false
  }
];

const CATEGORIES = ["All", "Sustainability", "Technology", "Tech", "Industry", "Community", "Innovation"];

export const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
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
    }, [activeCategory]); // Re-observe when items filter

    const filteredPosts = activeCategory === "All" 
        ? BLOG_POSTS 
        : BLOG_POSTS.filter(post => post.category === activeCategory);

    const featuredPost = BLOG_POSTS.find(post => post.isFeatured);
    const regularPosts = filteredPosts.filter(post => !post.isFeatured || activeCategory !== "All");

    return (
        <div className="blog-page">
            <Navbar />
            <main>
                <section className="blog-hero container reveal">
                    <h3>The Wastify Blog</h3>
                    <h1>Insights for a Sustainable Future</h1>
                    <p>Exploring the intersection of technology, circular economy, and industrial efficiency.</p>
                </section>

                <div className="container">
                    <div className="blog-filters reveal delay-1">
                        {CATEGORIES.map(category => (
                            <button 
                                key={category}
                                className={`filter-pill ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="blog-grid">
                        {/* Only show featured across all categories if on "All" */}
                        {activeCategory === "All" && featuredPost && (
                            <article className="blog-card featured-post reveal delay-2">
                                <div className="blog-image">
                                    <img src={featuredPost.image} alt={featuredPost.title} />
                                </div>
                                <div className="blog-content">
                                    <span className="blog-tag">{featuredPost.category}</span>
                                    <h2 className="blog-title">{featuredPost.title}</h2>
                                    <p className="blog-excerpt">{featuredPost.excerpt}</p>
                                    <div className="blog-footer">
                                        <div className="blog-author">
                                            <div className="author-avatar" />
                                            <div className="author-info">
                                                <span className="author-name">{featuredPost.author}</span>
                                                <span className="blog-date">{featuredPost.date}</span>
                                            </div>
                                        </div>
                                        <GlowButton size="small" href={`#/blog/${featuredPost.id}`}>Read Post</GlowButton>
                                    </div>
                                </div>
                            </article>
                        )}

                        {regularPosts.map((post, index) => (
                            <article key={post.id} className={`blog-card reveal delay-${(index % 3) + 1}`}>
                                <div className="blog-image">
                                    <img src={post.image} alt={post.title} />
                                </div>
                                <div className="blog-content">
                                    <span className="blog-tag">{post.category}</span>
                                    <h3 className="blog-title" style={{fontSize: '1.25rem'}}>{post.title}</h3>
                                    <p className="blog-excerpt">{post.excerpt}</p>
                                    <div className="blog-footer" style={{marginTop: 'auto'}}>
                                        <div className="blog-author">
                                            <div className="author-avatar" />
                                            <div className="author-info">
                                                <span className="author-name">{post.author}</span>
                                                <span className="blog-date">{post.date}</span>
                                            </div>
                                        </div>
                                        <a href={`#/blog/${post.id}`} className="text-green" style={{fontSize: '0.9rem', fontWeight: '600'}}>Read More →</a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="blog-pagination reveal">
                        <GlowButton variant="secondary">View More Articles</GlowButton>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
