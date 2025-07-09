import { useState, useRef } from "react";
import Search from "./scenes/search/Search";
import Library from "./library/Library";
import AudioPlayer from "./scenes/audio-player/AudioPlayer";
import AudioVisualizer from "./scenes/audio-visualizer/audioVisualizer";
import Sidebar from "./components/Sidebar";

function App() {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const audioRef = useRef(null);

  const handleSetAudioElement = (el) => {
    audioRef.current = el;
    setIsAudioReady(true);
  };

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden">
        {isAudioReady && <AudioVisualizer audioRef={audioRef} />}

        <div className="relative z-10">
          {selectedTrackId && (
            <AudioPlayer
              trackId={selectedTrackId}
              title="HI"
              artist="HO"
              artworkUrl="YO"
              audioRef={audioRef}
              setAudioElement={handleSetAudioElement}
            />
          )}
        </div>
      </div>
      <Sidebar
        setShowSearch={() => {
          setShowSearch(true);
          setShowLibrary(false);
        }}
        setShowLibrary={() => {
          setShowLibrary(true);
          setShowSearch(false);
        }}
      />

      {showSearch && (
        <Search
          open={showSearch}
          setSelectedTrackId={setSelectedTrackId}
          setSelectedPlaylistId={setSelectedPlaylistId}
          setSelectedUserId={setSelectedUserId}
          onClose={() => setShowSearch(false)}
        />
      )}
      {showLibrary && (
        <Library open={showLibrary} onClose={() => setShowLibrary(false)} />
      )}
    </>
  );
}

export default App;
