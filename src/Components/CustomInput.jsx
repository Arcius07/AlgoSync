import React, { useState } from "react";
import "../styles/CustomInput.css";

function CustomInput({ isOpen, onClose, onDataSubmit }) {
    const [inputValue, setInputValue] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const parsedArray = inputValue
            .split(",")
            .map(num => parseInt(num.trim(), 10))
            .filter(num => !isNaN(num) && num > 0);

        if (parsedArray.length > 0) {
            onDataSubmit(parsedArray);
            setInputValue(""); 
            onClose();
        }
    };

    return (
        <div className="custom-input-portal-stage">
            <div className="custom-input-overlay" onClick={onClose}></div>
            
            <div className="custom-input-window">
                <div className="matrix-scan-laser-line"></div>
                
                <div className="custom-input-header">
                    <span className="input-header-text">SYSTEM DATA INPUT TERMINAL</span>
                    <button type="button" className="input-close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="custom-input-core">
                    <h2 className="input-main-title">INSERT DATA MATRIX</h2>

                    <div className="terminal-field-wrapper">
                        <div className="input-terminal-prompt">&gt;_</div>
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="5, 3, 8, 1..." 
                            className="cyber-terminal-input"
                            autoFocus
                        />
                    </div>

                    <button type="submit" className="cyber-insert-action-btn">
                        <span className="insert-action-text">INITIALIZE ARRAY</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CustomInput;