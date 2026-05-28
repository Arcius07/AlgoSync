import React, { useState, useRef } from "react";
import { useSoundEngine } from "../sounds/AudioContent.jsx";
import "../styles/StatsPanel.css";

function StatsPanel({ 
    swaps = 0, 
    comparisons = 0, 
    complexity = "N/A", 
    onSpeedChange,
    onPrevious,
    onNext,
    onSearchSubmit
}) {
    const [speed, setSpeed] = useState(50);
    const [targetInput, setTargetInput] = useState("");
    const { playHoverTick, playMenuClick } = useSoundEngine();
    
    const lastTrackedSpeedRef = useRef(50);

    const handleSpeedSlider = (e) => {
        const val = parseInt(e.target.value, 10);
        setSpeed(val);
        if (val !== lastTrackedSpeedRef.current) {
            playHoverTick();
            lastTrackedSpeedRef.current = val;
        }

        if (onSpeedChange) onSpeedChange(val);
    };

    const handleSearchChange = (e) => {
        setTargetInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearchSubmit) {
            playMenuClick();
            onSearchSubmit(targetInput);
        }
    };

    const handleNavStep = (navActionCallback) => {
        playMenuClick();
        if (navActionCallback) navActionCallback();
    };

    return (
        <div className="stats-sidebar-wrapper">
            <div className="stats-main-panel">
                <h3 className="panel-header-title">Performance Stats</h3>
                
                <div className="metrics-container">
                    <div className="metric-row">
                        <span className="metric-label">Swaps :</span>
                        <span className="metric-value">{swaps}</span>
                    </div>
                    <div className="metric-row">
                        <span className="metric-label">Comparisons :</span>
                        <span className="metric-value">{comparisons}</span>
                    </div>
                    <div className="metric-row">
                        <span className="metric-label">Complexity :</span>
                        <span className="metric-value spec-weight">{complexity}</span>
                    </div>
                </div>

                <div className="speed-control-section">
                    <h4 className="speed-header-title">Speed</h4>
                    <div className="slider-track-container">
                        <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={speed} 
                            onChange={handleSpeedSlider}
                            className="cyber-range-slider" 
                            style={{ '--slider-progress': `${speed}%` }}
                        />
                    </div>
                </div>

                <div className="step-navigation-row">
                    <button className="nav-step-btn" onClick={() => handleNavStep(onPrevious)}>
                        <span>Previous</span>
                    </button>
                    <button className="nav-step-btn" onClick={() => handleNavStep(onNext)}>
                        <span>Next</span>
                    </button>
                </div>
            </div>

            <div className="target-input-section">
                <label className="target-heading-label">Target Number</label>
                <div className="terminal-input-container">
                    <input 
                        type="text" 
                        placeholder="Enter target to search" 
                        value={targetInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="terminal-text-field"
                    />
                </div>
            </div>
        </div>
    );
}

export default StatsPanel;