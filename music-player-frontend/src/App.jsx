import { useState, useRef } from "react";
import Search from "./scenes/searchField";
import AudioPlayer from "./scenes/audioControls";
import AudioVisualizer from "./scenes/audioVisualizer";

function App() {
  const [trackId, setTrackId] = useState(null);
  const audioRef = useRef(null);

  const handleSetAudioElement = (el) => {
    audioRef.current = el;
  };

  return (
    <>
      <Search setSelectedTrackId={setTrackId} />
      <AudioVisualizer trackId={trackId} audioRef={audioRef} />

      {/* 🔥 Don't render a separate <audio /> */}
      {/* {trackId && (
        <audio
          ref={audioRef}
          src={`/api/stream/${trackId}`}
          crossOrigin="anonymous"
          controls
        />
      )} */}

      <AudioPlayer trackId={trackId} setAudioElement={handleSetAudioElement} />
    </>
  );
}

export default App;
