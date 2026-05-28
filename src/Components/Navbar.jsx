import "../styles/Navbar.css";
import { useState } from "react";
import { useSoundEngine } from "../sounds/AudioContent.jsx";

function Navbar({
    setIsLoading,
    setSelectedAlgo,
    setLoadingAlgo,
    selectedAlgo
}) {
    const [openMenu, setOpenMenu] = useState("");
    const { playHoverTick, playMenuClick } = useSoundEngine();

    const handleMenuHeaderClick = (menuType) => {
        playMenuClick();
        setOpenMenu(openMenu === menuType ? "" : menuType);
    };

    const handleAlgoClick = (algoId, algoName) => {
        playMenuClick();
        setLoadingAlgo(algoName);
        setIsLoading(true);

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
                                onMouseEnter={playHoverTick}
                                onClick={() => handleAlgoClick(algo, algo)}
                            >
                                {algo}
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                                onMouseEnter={playHoverTick}
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