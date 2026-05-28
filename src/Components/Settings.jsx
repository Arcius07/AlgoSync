import React, { useState } from "react";
import { useSoundEngine } from "../sounds/AudioContent.jsx"; 
import "../styles/Settings.css";

function Settings({ popupDuration, setPopupDuration, isGlitchActive, setIsGlitchActive }) {
    const { setEngineMute, setEngineVolume, playMenuClick, initAudioEngine } = useSoundEngine(); 
    
    const [isOpen, setIsOpen] = useState(false);
    const [soundActive, setSoundActive] = useState(false); 
    const [volume, setVolume] = useState(70);
    const [showAudioWarning, setShowAudioWarning] = useState(false);

    const handleToggleModal = () => {
        playMenuClick(); 
        setIsOpen(!isOpen);
        if (isOpen) setShowAudioWarning(false); 
    };

    const handleAudioToggle = (e) => {
        const wantsToEnable = e.target.checked;
        if (wantsToEnable) {
            setShowAudioWarning(true);
        } else {
            setSoundActive(false);
            setEngineMute(true);
        }
    };

    const confirmEnableAudio = () => {
        setShowAudioWarning(false);
        setSoundActive(true);
        setEngineMute(false);
        initAudioEngine(); 
    };

    const cancelEnableAudio = () => {
        setShowAudioWarning(false);
    };

    return (
        <>
            <button className={`settings-trigger-hex ${isOpen ? "trigger-active" : ""}`} onClick={handleToggleModal} aria-label="Open system settings panel">
                <div className="hex-border-glowing"></div>
                <div className="hex-interior-chassis">
                    <svg className="gear-vector-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14.00 2H10.00C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10.00 22H14.00C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.27 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98ZM12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z" fill="currentColor"/>
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="settings-modal-overlay" onClick={handleToggleModal}>
                    <div className="settings-window-panel" onClick={(e) => e.stopPropagation()}>
                        
                        {showAudioWarning && (
                            <div className="audio-warning-overlay">
                                <div className="audio-warning-panel">
                                    <h3 className="warning-title">EXPERIMENTAL FEATURE</h3>
                                    <p className="warning-text">
                                        The sound system creates audio effects in real time. During very fast sorting, this can put extra load on your browser and may cause sound glitches or small lag spikes.
                                        <br/><br/>
                                        Enable at your own risk?
                                    </p>
                                    <div className="warning-btn-row">
                                        <button className="warning-btn btn-cancel" onClick={cancelEnableAudio}>CANCEL</button>
                                        <button className="warning-btn btn-confirm" onClick={confirmEnableAudio}>OVERRIDE</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="settings-panel-header">
                            <span className="panel-header-text">SYSTEM CONFIGURATION</span>
                            <button className="panel-close-x-btn" onClick={handleToggleModal}>&times;</button>
                        </div>

                        <div className="settings-interior-layout">
                            <h2 className="settings-main-heading">SETTINGS</h2>

                            <div className="options-matrix-grid">
                                <div className="option-control-row">
                                    <label className="cyber-checkbox-label">
                                        <input type="checkbox" checked={isGlitchActive} onChange={(e) => setIsGlitchActive(e.target.checked)} className="hidden-native-checkbox" />
                                        <span className="custom-cyber-square"></span>
                                        <span className="checkbox-display-text">GLITCH EFFECT</span>
                                    </label>
                                </div>

                                <div className="option-control-row">
                                    <label className="cyber-checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            checked={soundActive} 
                                            onChange={handleAudioToggle} 
                                            className="hidden-native-checkbox" 
                                        />
                                        <span className="custom-cyber-square"></span>
                                        <span className="checkbox-display-text">AUDIO ENGINE</span>
                                    </label>
                                </div>

                                <div className={`option-control-row volume-slider-row ${!soundActive ? "row-disabled" : ""}`}>
                                    <div className="volume-label-group">
                                        <span className="volume-label-title">VOLUME GAIN</span>
                                        <span className="volume-metric-readout">{volume}%</span>
                                    </div>
                                    <div className="volume-slider-track-box">
                                        <input 
                                            type="range" min="0" max="100" disabled={!soundActive} value={volume}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value, 10);
                                                setVolume(val);
                                                setEngineVolume(val); 
                                            }}
                                            className="settings-volume-slider"
                                            style={{ '--vol-progress': `${volume}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="option-control-row volume-slider-row">
                                    <div className="volume-label-group">
                                        <span className="volume-label-title">POPUP DURATION</span>
                                        <span className="volume-metric-readout" style={{ color: '#00ff66', textShadow: '0 0 5px rgba(0, 255, 102, 0.4)' }}>
                                            {popupDuration === 0 ? "∞ (PERMANENT)" : `${popupDuration}s`}
                                        </span>
                                    </div>
                                    <div className="volume-slider-track-box">
                                        <input 
                                            type="range" min="0" max="15" step="0.5" value={popupDuration} 
                                            onChange={(e) => setPopupDuration(Number(e.target.value))}
                                            className="settings-volume-slider"
                                            style={{ '--vol-progress': `${(popupDuration / 15) * 100}%`, accentColor: '#00cfff' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="settings-save-btn" onClick={handleToggleModal}>
                                <span className="save-btn-text">SAVE CONFIG</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Settings;