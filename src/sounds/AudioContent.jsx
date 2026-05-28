import React, { createContext, useContext, useRef, useCallback, useEffect } from "react";

import hoverSfx from "./assets/hover.mp3";
import clickSfx from "./assets/click.mp3";
import typingSfx from "./assets/typing.mp3";
import comparisonSfx from "./assets/comparison.mp3";
import swapSfx from "./assets/swap.mp3";
import completeSfx from "./assets/complete.mp3";
import targetSfx from "./assets/target.mp3";
import statsSfx from "./assets/stats.mp3";
import speedSfx from "./assets/speed.mp3";
import processingSfx from "./assets/processing.mp3";
import notFoundSfx from "./assets/notfound.mp3";

const SoundEngineContext = createContext(null);

export function AudioContextProvider({ children }) {
    const audioCtxRef = useRef(null);
    const masterGainRef = useRef(null);
    const isSoundEnabledRef = useRef(false);
    const volumeRef = useRef(0.7);

    const hoverAudio = useRef(new Audio(hoverSfx));
    const clickAudio = useRef(new Audio(clickSfx));
    const typingAudio = useRef(new Audio(typingSfx));
    const comparisonAudio = useRef(new Audio(comparisonSfx));
    const swapAudio = useRef(new Audio(swapSfx));
    const statsAudio = useRef(new Audio(statsSfx));
    const speedAudio = useRef(new Audio(speedSfx));
    const processingAudio = useRef(new Audio(processingSfx));
    
    const fallbackVictory = useRef(new Audio(completeSfx));
    const fallbackTargetLocked = useRef(new Audio(targetSfx));
    const fallbackNotFound = useRef(new Audio(notFoundSfx));

    const audioBuffersRef = useRef({
        victory: null,
        targetLocked: null,
        notFound: null
    });

    const initAudioEngine = useCallback(() => {
        try {
            if (!audioCtxRef.current) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                audioCtxRef.current = new AudioContextClass();
                masterGainRef.current = audioCtxRef.current.createGain();
                masterGainRef.current.gain.setValueAtTime(volumeRef.current, audioCtxRef.current.currentTime);
                masterGainRef.current.connect(audioCtxRef.current.destination);
                
                preloadVoiceBuffer("victory", completeSfx);
                preloadVoiceBuffer("targetLocked", targetSfx);
                preloadVoiceBuffer("notFound", notFoundSfx);
            }
            if (audioCtxRef.current.state === "suspended") {
                audioCtxRef.current.resume();
            }
        } catch (error) {
            console.error("Advanced Web Audio framework connection failure:", error);
        }
    }, []);

    const preloadVoiceBuffer = async (key, assetPath) => {
        try {
            const response = await fetch(assetPath);
            const arrayBuffer = await response.arrayBuffer();
            if (audioCtxRef.current) {
                audioCtxRef.current.decodeAudioData(arrayBuffer, (decodedData) => {
                    audioBuffersRef.current[key] = decodedData;
                }, (err) => console.error("Hardware decoding failure for asset:", key, err));
            }
        } catch (e) {
            console.error("Network fetching failure for asset voice:", key, e);
        }
    };

    useEffect(() => {
        const warmup = () => {
            initAudioEngine();
            window.removeEventListener("click", warmup);
            window.removeEventListener("keydown", warmup);
        };
        window.addEventListener("click", warmup);
        window.addEventListener("keydown", warmup);
        return () => {
            window.removeEventListener("click", warmup);
            window.removeEventListener("keydown", warmup);
        };
    }, [initAudioEngine]);

    const setEngineMute = useCallback((isMuted) => {
        isSoundEnabledRef.current = !isMuted;
        if (isMuted) {
            processingAudio.current.pause();
        }
    }, []);

    const setEngineVolume = useCallback((volumePercent) => {
        const computedVolume = volumePercent / 100;
        volumeRef.current = computedVolume;
        if (masterGainRef.current && audioCtxRef.current) {
            masterGainRef.current.gain.setValueAtTime(computedVolume, audioCtxRef.current.currentTime);
        }
    }, []);

    const playHoverTick = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        const sound = hoverAudio.current;
        sound.currentTime = 0;
        sound.volume = volumeRef.current;
        sound.play().catch(() => {});
    }, []);

    const playMenuClick = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        const sound = clickAudio.current;
        sound.currentTime = 0;
        sound.volume = volumeRef.current;
        sound.play().catch(() => {});
    }, []);

    const playTypingSound = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        const sound = typingAudio.current;
        sound.currentTime = 0;
        sound.volume = volumeRef.current;
        sound.play().catch(() => {});
    }, []);

    const playComparisonSound = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        const soundClone = comparisonAudio.current.cloneNode(); 
        soundClone.volume = volumeRef.current;
        soundClone.play().catch(() => {});
    }, []);

    const playSwapSound = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        const soundClone = swapAudio.current.cloneNode();
        soundClone.volume = volumeRef.current;
        soundClone.play().catch(() => {});
    }, []);

    const playStatsSound = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        const sound = statsAudio.current;
        sound.currentTime = 0;
        sound.volume = volumeRef.current;
        sound.play().catch(() => {});
    }, []);

    const playSpeedSound = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        const sound = speedAudio.current;
        sound.currentTime = 0;
        sound.volume = volumeRef.current;
        sound.play().catch(() => {});
    }, []);

    const playProcessingSound = useCallback((shouldPlay) => {
        const sound = processingAudio.current;
        if (!isSoundEnabledRef.current || !shouldPlay) {
            sound.pause();
            sound.currentTime = 0;
            return;
        }
        sound.currentTime = 0; 
        sound.volume = volumeRef.current;
        sound.play().catch(() => {});
    }, []);

    const runModulatorGraphPipeline = (bufferData, fallbackAudioElement) => {
        if (!bufferData) {
            if (fallbackAudioElement && isSoundEnabledRef.current) {
                fallbackAudioElement.currentTime = 0;
                fallbackAudioElement.volume = volumeRef.current;
                fallbackAudioElement.play().catch(() => {});
            }
            return;
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") ctx.resume();

        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = bufferData;

        const highPass = ctx.createBiquadFilter();
        highPass.type = "highpass";
        highPass.frequency.setValueAtTime(480, ctx.currentTime);

        const metallicResonator = ctx.createBiquadFilter();
        metallicResonator.type = "peaking";
        metallicResonator.frequency.setValueAtTime(1350, ctx.currentTime);
        metallicResonator.Q.setValueAtTime(14, ctx.currentTime);
        metallicResonator.gain.setValueAtTime(18, ctx.currentTime);

        const ringModGain = ctx.createGain();
        ringModGain.gain.setValueAtTime(0.8, ctx.currentTime);

        const carrierOsc = ctx.createOscillator();
        carrierOsc.type = "sawtooth";
        carrierOsc.frequency.setValueAtTime(65, ctx.currentTime);

        bufferSource.connect(highPass);
        highPass.connect(metallicResonator);
        metallicResonator.connect(ringModGain);
        ringModGain.connect(masterGainRef.current);

        carrierOsc.connect(ringModGain.gain);

        carrierOsc.start();
        bufferSource.start(0);

        bufferSource.onended = () => {
            try {
                carrierOsc.stop();
                carrierOsc.disconnect();
                bufferSource.disconnect();
                highPass.disconnect();
                metallicResonator.disconnect();
                ringModGain.disconnect();
            } catch (e) {}
        };
    };

    const playVictorySound = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        initAudioEngine();
        runModulatorGraphPipeline(audioBuffersRef.current.victory, fallbackVictory.current);
    }, [initAudioEngine]);

    const playSearchTargetSound = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        initAudioEngine();
        runModulatorGraphPipeline(audioBuffersRef.current.targetLocked, fallbackTargetLocked.current);
    }, [initAudioEngine]);

    const playTargetNotFoundSound = useCallback(() => {
        if (!isSoundEnabledRef.current) return;
        initAudioEngine();
        runModulatorGraphPipeline(audioBuffersRef.current.notFound, fallbackNotFound.current);
    }, [initAudioEngine]);

    return (
        <SoundEngineContext.Provider value={{
            setEngineMute,
            setEngineVolume,
            playComparisonSound,
            playSwapSound,
            playVictorySound,
            playSearchTargetSound,
            playTargetNotFoundSound, 
            playStatsSound,
            playSpeedSound,
            playProcessingSound,
            playHoverTick,
            playMenuClick,
            playTypingSound,
            initAudioEngine
        }}>
            {children}
        </SoundEngineContext.Provider>
    );
}

export function useSoundEngine() {
    const context = useContext(SoundEngineContext);
    if (!context) {
        throw new Error("useSoundEngine must be deployed inside an AudioContextProvider tree.");
    }
    return context;
}