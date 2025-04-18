import { useState, useEffect, useRef, useCallback } from "react";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import AudioMotionAnalyzer from "audiomotion-analyzer";

import { rainbowGraph, bars } from "./visualizerPatterns";

export default function AudioVisualizer({ trackId, audioRef }) {
  const containerRef = useRef(null);
  const analyzerRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!trackId || !containerRef.current) return;

    // Check every 200ms for when audioRef becomes available
    const interval = setInterval(() => {
      if (audioRef.current && !analyzerRef.current) {
        console.log("🎧 audioRef connected!", audioRef.current);

        analyzerRef.current = new AudioMotionAnalyzer(containerRef.current, {
          height: 200,
          gradient: "classic",
        });

        analyzerRef.current.connectInput(audioRef.current);
        console.log("🎛️ Analyzer created and connected");
        console.log(analyzerRef.current.connectedSources);
        //analyzerRef.current.disconnectInput(audioRef.current);

        clearInterval(interval); // Stop checking once connected
      }
    }, 200);

    // Cleanup on unmount or track change
    return () => {
      clearInterval(interval);
      if (analyzerRef.current) {
        analyzerRef.current.disconnectInput();
        analyzerRef.current.destroy();
        analyzerRef.current = null;
        console.log("🧹 Analyzer cleaned up");
      }
    };
  }, [trackId]);

  const goForwardPattern = useCallback(() => {
    setIndex((prev) => (prev + 1) % 2); // update when more patterns are added
  }, []);

  const goBackPattern = useCallback(() => {
    setIndex((prev) => (prev - 1 + 2) % 2);
  }, []);

  if (!trackId) {
    return <div className="w-full h-[200px] bg-black" />;
  }

  console.log("🔊 audioRef.current", audioRef.current);
  console.log("📦 containerRef.current", containerRef.current);
  console.log("🎛️ analyzerRef.current", analyzerRef.current);

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="w-full h-[200px]" />
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button onClick={goBackPattern}>
          <IoChevronBackOutline />
        </button>
        <button onClick={goForwardPattern}>
          <IoChevronForwardOutline />
        </button>
      </div>
    </div>
  );
}
