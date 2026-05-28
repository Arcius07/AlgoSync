import React from "react";
import "../styles/SearchBar.css";

function SearchHUD({ selectedAlgo, isPlaying, value, onChange }) {
    const isSearchingAlgo = selectedAlgo && selectedAlgo.toLowerCase().includes("search");

    if (!isSearchingAlgo) return null;

    return (
        <div className="search-target-hud-pod">
            <div className="hud-pod-laser-accent"></div>
            <label className="hud-pod-label">TARGET KEY</label>
            <div className="hud-pod-field-row">
                <span className="hud-pod-symbol">&gt;</span>
                <input 
                    type="number" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="000"
                    className="hud-pod-input"
                    disabled={isPlaying}
                />
            </div>
        </div>
    );
}

export default SearchHUD;