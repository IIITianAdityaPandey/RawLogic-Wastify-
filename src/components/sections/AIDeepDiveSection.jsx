import React from 'react';
import './AIDeepDiveSection.css';

export const AIDeepDiveSection = () => {
    return (
        <section className="ai-deep-dive" id="tech">
            <div className="container">
                <div className="section-header text-center reveal">
                    <h2>The <span className="text-green">AI</span> Under the Hood</h2>
                    <p className="section-subtitle">A multi-stage inference pipeline built for accuracy at scale.</p>
                </div>

                <div className="ai-layout reveal delay-1">
                    <div className="ai-pipeline">
                        <div className="pipeline-step">
                            <div className="step-box">Image Upload</div>
                            <div className="arrow">↓</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="step-box">Auto-Compress <span className="tech-tag">Canvas API</span></div>
                            <div className="arrow">↓</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="step-box highlight-box">YOLOv8 Object Detection</div>
                            <div className="arrow">↓</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="step-box highlight-box">CNN Classifier & Scorer</div>
                            <div className="arrow">↓</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="step-box">Confidence Check Router</div>
                            <div className="arrow">↓</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="step-box success-box">Result Output</div>
                        </div>
                    </div>

                    <div className="ai-details">
                        <div className="confidence-card mb-4">
                            <h4>Confidence Thresholds</h4>
                            <ul className="threshold-list">
                                <li><span className="icon success">✅</span> {'>'} 80% confidence <span className="muted-arrow">→</span> Auto-approved</li>
                                <li><span className="icon warning">⚠️</span> 60–80% <span className="muted-arrow">→</span> Flagged for human review</li>
                                <li><span className="icon error">❌</span> {'<'} 60% <span className="muted-arrow">→</span> Rejected / re-upload requested</li>
                            </ul>
                        </div>

                        <div className="code-block-container">
                            <div className="code-header">
                                <span>POST /v1/classify</span>
                                <span className="response-time">24ms</span>
                            </div>
                            <pre className="code-block">
                                <code>
                                    {`{
  "material_type": "Metal",
  "condition_score": 7,
  "purity_estimate": "84%",
  "reusability_tag": "Recyclable",
  "confidence": 0.91
}`}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
