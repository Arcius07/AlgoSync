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

    useEffect(() => {
        if (isLoading) {
            playProcessingSound(true);
        } else {
            playProcessingSound(false);
        }

        return () => {
            playProcessingSound(false);
        };
    }, [isLoading, playProcessingSound]);

    const handleTabSwitch = (targetTab) => {
        if (activeTab === targetTab) return;
        playStatsSound();
        setActiveTab(targetTab);
    };

    const handleDialSlider = (e) => {
        const computedStep = Math.min(10, Math.floor((e.target.value / 100) * 9) + 1);
        
        if (computedStep !== algoSpeed) {
            playHoverTick();
        }
        
        if (onSpeedChange) onSpeedChange(computedStep);
    };

    const handleNavStep = (navActionCallback) => {
        playMenuClick();
        if (navActionCallback) navActionCallback();
    };

    const currentAlgo = isLoading ? loadingAlgo : selectedAlgo;
    if (!currentAlgo) return null;

    return (
        <div className={`Wrapper ${activeTab === "STATS" && !isLoading ? "expanded-stats-mode" : ""}`}>
            
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
                    <div className="stats-inner-layout">
                        <div className="stats-algo-header">
                            {(typeof currentAlgo === "string" ? currentAlgo : currentAlgo.name)?.toUpperCase()}
                        </div>
                        
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

                                <div 
                                    className="dial-dot-indicator" 
                                    style={{ '--active-index': algoSpeed - 1 }}
                                />
                                
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