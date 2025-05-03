import { useState, useRef } from "react";
import Search from "./scenes/searchField";
import AudioPlayer from "./scenes/audioControls";
import AudioVisualizer from "./scenes/audio-visualizer/audioVisualizer";

function App() {
  const [trackId, setTrackId] = useState(null);
  const audioRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const handleSetAudioElement = (el) => {
    audioRef.current = el;
    setIsAudioReady(true); // trigger re-render
  };

  return (
    <>
      <Search setSelectedTrackId={setTrackId} />
      {isAudioReady && <AudioVisualizer audioRef={audioRef} />}
      <AudioPlayer
        trackId={trackId}
        audioRef={audioRef}
        setAudioElement={handleSetAudioElement}
      />
    </>
  );
}

export default App;
