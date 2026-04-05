import React, { useState, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlowButton, OutlineButton } from '../components/ui/Button';
import { analyzeMaterialImage } from '../services/aiService';
import { createMaterialListing } from '../services/materialService';
import { auth } from '../firebase/config';
import './AnalyzePage.css';

export const AnalyzePage = () => {
    const [image, setImage] = useState(null);
    const [base64, setBase64] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [userDescription, setUserDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(URL.createObjectURL(file));
                // Extract base64 without prefix for Gemini
                const base64String = reader.result.split(',')[1];
                setBase64(base64String);
                setAnalysisResult(null);
                setSuccess(false);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!base64 && !userDescription.trim()) return;
        
        setIsAnalyzing(true);
        setError(null);
        try {
            const result = await analyzeMaterialImage(base64, "image/jpeg", userDescription);
            setAnalysisResult(result);
        } catch (err) {
            setError("Analysis failed. Please try again with a clearer image.");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handlePostListing = async () => {
        if (!analysisResult || !base64) return;

        setIsPosting(true);
        setError(null);
        try {
            if (!auth.currentUser) {
                setError("Please login to post a listing.");
                return;
            }
            await createMaterialListing(analysisResult, base64);
            setSuccess(true);
            setTimeout(() => {
                window.location.hash = '#/marketplace';
            }, 2000);
        } catch (err) {
            let errorMsg = "Failed to create listing. Please check your connection.";
            if (err.code === "storage/unauthorized" || err.message.includes("unauthorized") || err.message.includes("permission")) {
                errorMsg = "Firebase Permission Error: Please update your Firebase Storage Security Rules to allow writes.";
            } else if (err.message) {
                errorMsg = `Failed to create listing: ${err.message}`;
            }
            setError(errorMsg);
            console.error(err);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="analyze-page">
            <Navbar />
            
            <main className="container">
                <header className="analyze-header">
                    <h1>Smart <span className="text-green">Listing</span></h1>
                    <p>Upload an image of your industrial waste or material, and let our AI handle the data entry for you.</p>
                </header>

                <div className="analyze-content-grid">
                    {/* Left: Upload Area */}
                    <div className="upload-preview-area">
                        <div 
                            className={`drop-zone ${image ? 'has-image' : ''}`}
                            onClick={() => !isAnalyzing && fileInputRef.current.click()}
                        >
                            {image ? (
                                <img src={image} alt="Upload preview" />
                            ) : (
                                <div className="drop-zone-placeholder">
                                    <div className="upload-icon">📤</div>
                                    <p>Drop image here or click to browse</p>
                                    <span>Supports JPG, PNG (Max 5MB)</span>
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                        
                        <div className="upload-actions">
                            {!analysisResult && (
                                <>
                                    <div className="manual-description-box">
                                        <label>Describe your waste or material</label>
                                        <textarea 
                                            placeholder="e.g. 20 tons of industrial HDPE regrind, cleaned and ready for processing..."
                                            value={userDescription}
                                            onChange={(e) => setUserDescription(e.target.value)}
                                            rows="4"
                                        />
                                    </div>
                                    <GlowButton 
                                        onClick={handleAnalyze} 
                                        disabled={isAnalyzing || (!image && !userDescription.trim())}
                                        style={{ width: '100%', marginTop: '16px' }}
                                    >
                                        {isAnalyzing ? "AI is Analyzing..." : "Analyze & Generate Listing"}
                                    </GlowButton>
                                </>
                            )}
                            {analysisResult && (
                                <OutlineButton 
                                    onClick={() => { setImage(null); setAnalysisResult(null); }}
                                    style={{ width: '100%' }}
                                >
                                    Try Another Image
                                </OutlineButton>
                            )}
                        </div>
                    </div>

                    {/* Right: Analysis Results */}
                    <div className="analysis-results-area">
                        {isAnalyzing ? (
                            <div className="analysis-loading">
                                <div className="loader-bars">
                                    <span></span><span></span><span></span>
                                </div>
                                <p>Identifying materials, estimating purity, and generating condition metadata...</p>
                            </div>
                        ) : analysisResult ? (
                            <div className="analysis-data-card card">
                                <div className="result-header">
                                    <h3>AI Analysis Results</h3>
                                    <span className="confidence-badge">High Confidence</span>
                                </div>
                                
                                <div className="result-grid">
                                    <div className="result-item">
                                        <label>Suggested Name</label>
                                        <p>{analysisResult.name}</p>
                                    </div>
                                    <div className="result-item">
                                        <label>Category</label>
                                        <span className="category-tag">{analysisResult.category}</span>
                                    </div>
                                    <div className="result-item">
                                        <label>Estimated Purity</label>
                                        <p>{analysisResult.purity}</p>
                                    </div>
                                    <div className="result-item">
                                        <label>Condition</label>
                                        <p>{analysisResult.condition}</p>
                                    </div>
                                    <div className="result-item wide">
                                        <label>AI Description</label>
                                        <p className="description-text">{analysisResult.description}</p>
                                    </div>
                                </div>

                                <div className="analysis-footer">
                                    {error && <p className="error-msg">{error}</p>}
                                    {success ? (
                                        <p className="success-msg">Successfully posted to Marketplace!</p>
                                    ) : (
                                        <GlowButton 
                                            onClick={handlePostListing} 
                                            disabled={isPosting}
                                            style={{ width: '100%', marginTop: '20px' }}
                                        >
                                            {isPosting ? "Posting..." : "Confirm & Post to Marketplace"}
                                        </GlowButton>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="analysis-placeholder">
                                <p>Analysis results will appear here after AI processing.</p>
                            </div>
                        )}
                        
                        {error && !analysisResult && <p className="error-msg" style={{ textAlign: 'center', marginTop: '20px' }}>{error}</p>}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
