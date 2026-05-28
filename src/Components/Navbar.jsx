import "../styles/Navbar.css";
import { useState } from "react";
import { useSoundEngine } from "../sounds/AudioContent.jsx"; // <-- Embedded audio chassis hook

function Navbar({
    setIsLoading,
    setSelectedAlgo,
    setLoadingAlgo,
    selectedAlgo
}) {
    const [openMenu, setOpenMenu] = useState("");
    const { playHoverTick, playMenuClick } = useSoundEngine(); // <-- Destructured custom sci-fi audio assets

    const handleMenuHeaderClick = (menuType) => {
        playMenuClick(); // Tactile click on dropdown header toggle
        setOpenMenu(openMenu === menuType ? "" : menuType);
    };

    const handleAlgoClick = (algoId, algoName) => {
        playMenuClick(); // Tactile command pop click (Button 1) on index selection
        setLoadingAlgo(algoName);
        setIsLoading(true);

        // Simulated processing handshake lag to drive the cinematic preloader bar sequence
        setTimeout(() => {
            setSelectedAlgo(algoId);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <nav className="navbar">
            <div>
                <span className="logo">AlgoSynth</span>
                <span className="version">v1.0</span>
            </div>

            {/* ==========================================================================
               1. SEARCHING ALGORITHMS DROPDOWN CHASSIS
               ========================================================================== */}
            <div className="menu-selection">
                <div 
                    className={`menu-header clickable ${openMenu === "search" ? "active" : ""}`}
                    onClick={() => handleMenuHeaderClick("search")}
                >
                    Searching Algorithms
                </div>
                
                {openMenu === "search" && (
                    <div className="menu-items">
                        {[
                            "Linear Search",
                            "Binary Search",
                            "Jump Search",
                            "Fibonacci Search"
                        ].map((algo) => (
                            <div 
                                key={algo}
                                className={`menu-item ${selectedAlgo === algo ? "active" : ""}`}
                                onMouseEnter={playHoverTick} // <-- Triggers premium minimal micro-click on hover
                                onClick={() => handleAlgoClick(algo, algo)}
                            >
                                {algo}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ==========================================================================
               2. SORTING ALGORITHMS DROPDOWN CHASSIS
               ========================================================================== */}
            <div className="menu-selection">
                <div 
                    className={`menu-header clickable ${openMenu === "sort" ? "active" : ""}`}
                    onClick={() => handleMenuHeaderClick("sort")}
                >
                    Sorting Algorithms
                </div>

                {openMenu === "sort" && (
                    <div className="menu-items">
                        {[
                            "Bubble Sort",
                            "Insertion Sort",
                            "Selection Sort",
                            "Quick Sort",
                            "Merge Sort",
                            "Heap Sort",
                            "Radix Sort",
                            "Bucket Sort"
                        ].map((algo) => (
                            <div 
                                key={algo}
                                className={`menu-item ${selectedAlgo === algo ? "active" : ""}`}
                                onMouseEnter={playHoverTick} // <-- Triggers premium minimal micro-click on hover
                                onClick={() => handleAlgoClick(algo, algo)}
                            >
                                {algo}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;