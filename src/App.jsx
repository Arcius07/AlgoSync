import bg from "./assets/bg.png";
import "./App.css";

import Navbar from "./Components/Navbar";
import LoadingBar from "./Components/LoadingBar";
import DisplayPanel from "./Components/DisplayPanel";
import Settings from "./Components/Settings";
import SearchBar from "./Components/SearchBar";

import { AudioContextProvider } from "./sounds/AudioContent.jsx";
import { useState, useRef } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const [loadingAlgo, setLoadingAlgo] = useState("");
  const [searchTarget, setSearchTarget] = useState("50");
  const [isPlaying, setIsPlaying] = useState(false);      

  const [swaps, setSwaps] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [complexity, setComplexity] = useState("N/A");
  const [algoSpeed, setAlgoSpeed] = useState(5); 
  const [popupDuration, setPopupDuration] = useState(1.5); 
  
  const [isGlitchActive, setIsGlitchActive] = useState(false);

  const displayPanelRef = useRef(null);

  const handleSpeedChange = (newSpeed) => {
    setAlgoSpeed(newSpeed);
  };

  const handlePreviousStep = () => {
    if (displayPanelRef.current) {
      displayPanelRef.current.stepBackward();
    }
  };

  const handleNextStep = () => {
    if (displayPanelRef.current) {
      displayPanelRef.current.stepForward();
    }
  };

  return (
    <AudioContextProvider>
      <div style={{ backgroundImage: `url(${bg})` }} className="Background">
        
        <Navbar 
          setIsLoading={setIsLoading}
          setSelectedAlgo={setSelectedAlgo}
          setLoadingAlgo={setLoadingAlgo}
          selectedAlgo={selectedAlgo}
        />
        
        <LoadingBar
          isLoading={isLoading}
          loadingAlgo={loadingAlgo}
          selectedAlgo={selectedAlgo}
          setSelectedAlgo={setSelectedAlgo}
          swaps={swaps}
          comparisons={comparisons}
          complexity={complexity}
          algoSpeed={algoSpeed}
          onSpeedChange={handleSpeedChange}
          onPrevious={handlePreviousStep}
          onNext={handleNextStep}
        />
        
        <DisplayPanel
          ref={displayPanelRef}
          isLoading={isLoading}
          loadingAlgo={loadingAlgo}
          selectedAlgo={selectedAlgo}
          searchTarget={searchTarget}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          setSwaps={setSwaps}
          setComparisons={setComparisons}
          setComplexity={setComplexity}
          algoSpeed={algoSpeed}
          popupDuration={popupDuration}
          isGlitchActive={isGlitchActive}
        />

        <Settings 
          popupDuration={popupDuration}
          setPopupDuration={setPopupDuration}
          isGlitchActive={isGlitchActive}
          setIsGlitchActive={setIsGlitchActive}
        />

        <SearchBar 
          selectedAlgo={selectedAlgo}
          isPlaying={isPlaying}
          value={searchTarget}
          onChange={setSearchTarget}
        />

      </div>
    </AudioContextProvider>
  );
}

export default App;