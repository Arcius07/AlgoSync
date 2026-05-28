import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import CustomInput from "./CustomInput"; 
import { executeAlgorithm } from "../Algorithms/route"; 
import { useSoundEngine } from "../sounds/AudioContent.jsx";

import "../styles/DisplayPanel.css";

const DisplayPanel = forwardRef(({ 
    isLoading, loadingAlgo, 
    selectedAlgo, searchTarget, 
    isPlaying, setIsPlaying,
    setSwaps, setComparisons, setComplexity, 
    algoSpeed, 
    popupDuration, 
    isGlitchActive
}, ref) => {
    const { 
        playComparisonSound, 
        playSwapSound, 
        playVictorySound, 
        playSearchTargetSound, 
        playTargetNotFoundSound, 
        playMenuClick, 
        playTypingSound,
        initAudioEngine
    } = useSoundEngine();

    const [chartData, setChartData] = useState([]);
    const [isInputModalOpen, setIsInputModalOpen] = useState(false);
    const [timelineSteps, setTimelineSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [isPaused, setIsPaused] = useState(false);
    
    const [activePointers, setActivePointers] = useState([]);
    const [comparingPairs, setComparingPairs] = useState([]);
    const [swappingPairs, setSwappingPairs] = useState([]);
    const [victoryIndex, setVictoryIndex] = useState(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    // ⚡ NEW: Emergency kill switch for button mashing
    const isKilledRef = useRef(false);
    
    const timerRef = useRef(null);
    const autoCloseTimeoutRef = useRef(null); 
    const originalDataRef = useRef([]); 
    const currentStepRef = useRef(0); 

    const isSearchingAlgo = selectedAlgo && selectedAlgo.toLowerCase().includes("search");

    const complexityMap = {
        "Linear Search": "O(n)", "Binary Search": "O(log n)", "Jump Search": "O(√n)", "Fibonacci Search": "O(log n)",
        "Bubble Sort": "O(n²)", "Insertion Sort": "O(n²)", "Selection Sort": "O(n²)", "Quick Sort": "O(n log n)",
        "Merge Sort": "O(n log n)", "Heap Sort": "O(n log n)", "Radix Sort": "O(nk)", "Bucket Sort": "O(n + k)"
    };

    const renderTimelineFrame = (stepObj, idx) => {
        if (!stepObj) return;
        
        setChartData(stepObj.array);
        currentStepRef.current = idx;
        setCurrentStepIndex(idx);

        if (isSearchingAlgo && stepObj.status === "FOUND" && stepObj.foundIndex !== null) {
            setVictoryIndex(stepObj.foundIndex);
            setActivePointers([]); setComparingPairs([]); setSwappingPairs([]);
            playSearchTargetSound(); 
            return;
        }

        if (isSearchingAlgo && stepObj.status === "NOT_FOUND") {
            setActivePointers([]); setComparingPairs([]); setSwappingPairs([]); setVictoryIndex(null);
            playTargetNotFoundSound(); 
            return;
        }

        setVictoryIndex(null);
        
        if (stepObj.pointers) {
            setActivePointers(stepObj.pointers);
            if (isSearchingAlgo && stepObj.pointers.length > 0) {
                playComparisonSound(); 
            }
        }
        
        if (stepObj.comparing) {
            setComparingPairs(stepObj.comparing);
            if (!isSearchingAlgo && stepObj.comparing.length > 0) {
                playComparisonSound(); 
            }
        }
        
        if (stepObj.swapping) {
            setSwappingPairs(stepObj.swapping);
            if (stepObj.swapping.length > 0) {
                playSwapSound(); 
            }
        }

        if (setSwaps && stepObj.swaps !== undefined) setSwaps(stepObj.swaps);
        if (setComparisons && stepObj.comparisons !== undefined) setComparisons(stepObj.comparisons);
    };

    useImperativeHandle(ref, () => ({
        stepForward() {
            initAudioEngine();
            let workingSteps = timelineSteps;
            if (workingSteps.length === 0) {
                const targetKey = isSearchingAlgo ? Number(searchTarget) : null;
                workingSteps = executeAlgorithm(selectedAlgo, [...originalDataRef.current], targetKey);
                if (!workingSteps || workingSteps.length === 0) return;
                setTimelineSteps(workingSteps);
            }

            if (isPlaying && !isPaused) {
                clearInterval(timerRef.current);
                setIsPaused(true);
            }

            const nextIdx = currentStepIndex + 1;
            if (nextIdx < workingSteps.length) {
                setShowCompleteModal(false);
                renderTimelineFrame(workingSteps[nextIdx], nextIdx);
                
                if (nextIdx === workingSteps.length - 1 && !isSearchingAlgo) {
                    setShowCompleteModal(true);
                    playVictorySound();
                }
            }
        },
        stepBackward() {
            initAudioEngine();
            if (timelineSteps.length === 0) return;

            if (isPlaying && !isPaused) {
                clearInterval(timerRef.current);
                setIsPaused(true);
            }

            const prevIdx = currentStepIndex - 1;
            if (prevIdx >= 0) {
                setShowCompleteModal(false);
                renderTimelineFrame(timelineSteps[prevIdx], prevIdx);
            }
        }
    }));

    const generateRandomData = () => {
        playMenuClick(); 
        const totalBars = 10;
        const randomArray = [];
        for (let i = 0; i < totalBars; i++) {
            const randomValue = Math.floor(Math.random() * (380 - 50 + 1)) + 50;
            randomArray.push(randomValue);
        }
        if (isSearchingAlgo && selectedAlgo !== "Linear Search") randomArray.sort((a, b) => a - b);
        setChartData(randomArray);
        originalDataRef.current = [...randomArray];
        resetPlaybackPointers();
    };

    // ⚡ AGGRESSIVE RESET: Kills intervals instantly
    const resetPlaybackPointers = () => {
        isKilledRef.current = true;
        clearInterval(timerRef.current);
        clearTimeout(autoCloseTimeoutRef.current);
        setIsPlaying(false);
        setIsPaused(false);
        setShowCompleteModal(false);
        setTimelineSteps([]);
        setCurrentStepIndex(-1);
        currentStepRef.current = 0;
        setActivePointers([]);
        setComparingPairs([]);
        setSwappingPairs([]);
        setVictoryIndex(null);
        if (setSwaps) setSwaps(0);
        if (setComparisons) setComparisons(0);
    };

    useEffect(() => {
        if (!isLoading && selectedAlgo) {
            generateRandomData();
            if (setComplexity) setComplexity(complexityMap[selectedAlgo] || "N/A");
        }
        return () => {
            isKilledRef.current = true;
            clearInterval(timerRef.current);
            clearTimeout(autoCloseTimeoutRef.current);
        };
    }, [isLoading, selectedAlgo]);

    useEffect(() => {
        if (isPlaying && !isPaused) startPlaybackInterval(timelineSteps);
    }, [algoSpeed]);

    const maxValue = chartData.length > 0 ? Math.max(...chartData) : 100;
    const getAlgoName = () => !selectedAlgo ? "" : typeof selectedAlgo === "string" ? selectedAlgo : selectedAlgo.name || "ALGORITHM";

    const handleCustomDataSubmit = (newCustomArray) => {
        if (isSearchingAlgo && selectedAlgo !== "Linear Search") newCustomArray.sort((a, b) => a - b);
        setChartData(newCustomArray);
        originalDataRef.current = [...newCustomArray];
        resetPlaybackPointers();
    };

    const handlePlayPauseToggle = () => {
        playMenuClick(); 
        initAudioEngine();
        
        if (isPlaying && !isPaused) {
            clearInterval(timerRef.current);
            setIsPaused(true);
            return;
        }
        if (isPlaying && isPaused) {
            setIsPaused(false);
            startPlaybackInterval(timelineSteps);
            return;
        }

        // FULL HARD RESET before starting a fresh run
        isKilledRef.current = true;
        clearInterval(timerRef.current);
        setVictoryIndex(null);
        setShowCompleteModal(false);
        setActivePointers([]);
        setComparingPairs([]);
        setSwappingPairs([]);

        const targetKey = isSearchingAlgo ? Number(searchTarget) : null;
        const steps = executeAlgorithm(selectedAlgo, [...originalDataRef.current], targetKey);
        
        if (!steps || steps.length === 0) return;
        
        setTimelineSteps(steps);
        setIsPlaying(true);
        setIsPaused(false);
        currentStepRef.current = 0;
        
        // Brief buffer for state resets before launching
        setTimeout(() => {
            startPlaybackInterval(steps);
        }, 50);
    };

    const startPlaybackInterval = (stepsArray) => {
        clearInterval(timerRef.current);
        isKilledRef.current = false;
        
        const msIntervalDelay = algoSpeed === 1 ? 1600 : Math.max(80, 1000 - (algoSpeed * 95));

        timerRef.current = setInterval(() => {
            // EMERGENCY ABORT 
            if (isKilledRef.current) {
                clearInterval(timerRef.current);
                return;
            }

            let stepIdx = currentStepRef.current;

            if (stepIdx >= stepsArray.length) {
                clearInterval(timerRef.current);
                setIsPlaying(false);
                setIsPaused(false);
                return;
            }

            const currentStepObj = stepsArray[stepIdx];
            renderTimelineFrame(currentStepObj, stepIdx);
            
            // EXACT FRAME VICTORY SYNC
            if (!isSearchingAlgo && stepIdx === stepsArray.length - 1) {
                if (!isKilledRef.current) {
                    setShowCompleteModal(true);
                    playVictorySound(); 
                    
                    if (popupDuration > 0) {
                        autoCloseTimeoutRef.current = setTimeout(() => {
                            setShowCompleteModal(false);
                        }, popupDuration * 1000);
                    }
                }
            }

            if (isSearchingAlgo && stepIdx === stepsArray.length - 1) {
                if (!isKilledRef.current && currentStepObj && currentStepObj.status !== "FOUND" && currentStepObj.status !== "NOT_FOUND") {
                    playTargetNotFoundSound();
                }
            }

            currentStepRef.current++;
        }, msIntervalDelay);
    };

    const runBtn = !isPlaying ? { text: "RUN", className: "" } : isPaused ? { text: "PAUSED", className: "state-paused-freeze" } : { text: "RUNNING", className: "state-running-active" };

    return (
        <div className="display-panel">
            <div className="cyber-grid"></div>

            <div className="display-inner">
                {isLoading ? (
                    <div className="display-loading">LOADING {loadingAlgo?.toUpperCase()}</div>
                ) : selectedAlgo ? (
                    <div className="display-active-container">
                        <h2 className="visualization-title">{getAlgoName().toUpperCase()}</h2>
                        
                        <div className="chart-area">
                            {chartData.map((value, index) => {
                                const heightPercentage = (value / maxValue) * 100;
                                const isVictory = victoryIndex === index;
                                const isSearchingPointer = activePointers.includes(index);
                                const isComparing = comparingPairs.includes(index);
                                const isSwapping = swappingPairs.includes(index);

                                let barHighlightClass = "";
                                if (isVictory) barHighlightClass = "bar-state-victory";
                                else if (isSwapping) barHighlightClass = "bar-state-swapping";
                                else if (isComparing) barHighlightClass = "bar-state-comparing";
                                else if (isSearchingPointer) barHighlightClass = "bar-pointer-focus";

                                return (
                                    <div className={`bar-container ${barHighlightClass}`} key={`${value}-${index}`} style={{ "--bar-index": index }}>
                                        <div className="bar" style={{ height: `${heightPercentage}%` }}>
                                            <div className={`bar-glitch-overlay ${isGlitchActive ? "visual-glitch-active" : ""}`}></div>
                                            <span className="bar-number">{value}</span>
                                        </div>
                                    </div>
                                );
                            })}

                            {showCompleteModal && (
                                <div className="sorting-complete-hud-overlay">
                                    <div className="hud-overlay-circuit-frame">
                                        <button className="hud-overlay-close-cross" onClick={() => { playMenuClick(); setShowCompleteModal(false); }}>✕</button>
                                        <h2 className="sorting-complete-hud-text">SORTING COMPLETE</h2>
                                        <p className="hud-overlay-subtitle">Algorithm process successful.</p>
                                        <button className="hud-overlay-ack-btn" onClick={() => { playMenuClick(); setShowCompleteModal(false); }}>
                                            <span>Acknowledge</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="button-row">
                            <button 
                                className="control-btn" 
                                onClick={() => { playTypingSound(); setIsInputModalOpen(true); }} 
                                disabled={isPlaying && !isPaused}
                            >
                                INSERT
                            </button>
                            <button className={`control-btn run-trigger-btn ${runBtn.className}`} onClick={handlePlayPauseToggle}>
                                {runBtn.text}
                            </button>
                            <button className="control-btn" onClick={generateRandomData}>RESET</button>
                        </div>
                    </div>
                ) : (
                    <div className="display-idle">SELECT AN ALGORITHM</div>
                )}
            </div>

            <CustomInput isOpen={isInputModalOpen} onClose={() => setIsInputModalOpen(false)} onDataSubmit={handleCustomDataSubmit} />
        </div>
    );
});

export default DisplayPanel;