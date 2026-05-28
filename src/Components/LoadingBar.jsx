import React, { useState, useEffect } from "react";
import { useSoundEngine } from "../sounds/AudioContent.jsx";
import "../styles/LoadingBar.css";

function LoadingBar({ 
    isLoading, 
    loadingAlgo, 
    selectedAlgo,
    swaps = 0,
    comparisons = 0,
    complexity = "N/A",
    algoSpeed = 5, 
    onSpeedChange,
    onPrevious,
    onNext
}) {
    const [activeTab, setActiveTab] = useState("STATUS");
    const { playStatsSound, playHoverTick, playMenuClick, playProcessingSound } = useSoundEngine();

    // 🛠️ HARDWARE TIME SYNCHRONIZATION FOR INTERFACE DATA STREAM
    useEffect(() => {
        if (isLoading) {
            playProcessingSound(true); // Fire up the data stream crunch instantly
        } else {
            playProcessingSound(false); // Snap the sound shut precisely at 100% completion
        }

        // Emergency cleanup if the component unmounts unexpectedly
        return () => {
            playProcessingSound(false);
        };
    }, [isLoading, playProcessingSound]);

    const handleTabSwitch = (targetTab) => {
        if (activeTab === targetTab) return;
        playStatsSound(); // Triggers analytical diagnostic double-pulse chime
        setActiveTab(targetTab);
    };

    const handleDialSlider = (e) => {
        const computedStep = Math.min(10, Math.floor((e.target.value / 100) * 9) + 1);
        
        // Only trigger the slider tick if it shifts into a brand-new integer segment block
        if (computedStep !== algoSpeed) {
            playHoverTick(); // Sleek micro-click feedback per segment
        }
        
        if (onSpeedChange) onSpeedChange(computedStep);
    };

    const handleNavStep = (navActionCallback) => {
        playMenuClick(); // Snappy tactical click on navigation actions
        if (navActionCallback) navActionCallback();
    };

    const currentAlgo = isLoading ? loadingAlgo : selectedAlgo;
    if (!currentAlgo) return null;

    return (
        <div className={`Wrapper ${activeTab === "STATS" && !isLoading ? "expanded-stats-mode" : ""}`}>
            
            {/* Header Tab Deck */}
            {!isLoading && (
                <div className="panel-tab-switcher">
                    <button 
                        className={`tab-toggle-btn ${activeTab === "STATUS" ? "tab-active" : ""}`}
                        onClick={() => handleTabSwitch("STATUS")}
                    >
                        STATUS PANEL
                    </button>
                    <button 
                        className={`tab-toggle-btn ${activeTab === "STATS" ? "tab-active" : ""}`}
                        onClick={() => handleTabSwitch("STATS")}
                    >
                        STATS
                    </button>
                </div>
            )}

            <div className="Loading-panel">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-text">
                            LOADING {
                                typeof currentAlgo === "string"
                                    ? currentAlgo.toUpperCase()
                                    : currentAlgo.name?.toUpperCase()
                            }...
                        </div>
                        <div className="loading-bar">
                            <div className="loading-fill"></div>
                        </div>
                    </div>
                ) : activeTab === "STATUS" ? (
                    /* ORIGINAL STATUS PANEL VIEW */
                    <div className="active-title">
                        <div className="algo-title">
                            {
                                typeof currentAlgo === "string"
                                    ? currentAlgo.toUpperCase()
                                    : currentAlgo.name?.toUpperCase()
                            }
                        </div>
                        <div className="status">
                            STATUS : ACTIVE
                        </div>
                    </div>
                ) : (
                    /* FULLY EQUIPPED LEFT SIDEBAR DECK */
                    <div className="stats-inner-layout">
                        <div className="stats-algo-header">
                            {(typeof currentAlgo === "string" ? currentAlgo : currentAlgo.name)?.toUpperCase()}
                        </div>
                        
                        {/* Live Counter Indicators */}
                        <div className="stats-matrix-rows">
                            <div className="stats-row">
                                <span className="stats-label">Swaps :</span>
                                <span className="stats-value">{swaps}</span>
                            </div>
                            <div className="stats-row">
                                <span className="stats-label">Comparisons :</span>
                                <span className="stats-value">{comparisons}</span>
                            </div>
                            <div className="stats-row">
                                <span className="stats-label">Complexity :</span>
                                <span className="stats-value highlight-text">{complexity}</span>
                            </div>
                        </div>

                        {/* Interactive Speed Control System */}
                        <div className="panel-speed-section">
                            <h4 className="panel-speed-title">SPEED CONTROL (1-10)</h4>
                            
                            <div className="radial-dial-container">
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="100" 
                                    value={((algoSpeed - 1) / 9) * 100}
                                    onChange={handleDialSlider}
                                    className="invisible-drag-intercept"
                                />

                                {/* The Single Tracking Pin Indicator */}
                                <div 
                                    className="dial-dot-indicator" 
                                    style={{ '--active-index': algoSpeed - 1 }}
                                />
                                
                                {/* The Semi-Circle Arc Grid Structure */}
                                <div className="dial-blocks-arc">
                                    {Array.from({ length: 10 }).map((_, index) => {
                                        const stepValue = index + 1;
                                        const isActive = stepValue <= algoSpeed;
                                        
                                        return (
                                            <div
                                                key={stepValue}
                                                className={`dial-segment-block ${isActive ? "segment-lit" : ""}`}
                                                style={{ '--block-index': index }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Embedded Action Navigation Controls */}
                        <div className="panel-navigation-row">
                            <button className="panel-nav-btn" onClick={() => handleNavStep(onPrevious)}>
                                <span>Previous</span>
                            </button>
                            <button className="panel-nav-btn" onClick={() => handleNavStep(onNext)}>
                                <span>Next</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoadingBar;