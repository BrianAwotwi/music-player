import { useState, useRef } from "react";
import Search from "./scenes/search/searchField";
import AudioPlayer from "./scenes/audioControls";
import AudioVisualizer from "./scenes/audio-visualizer/audioVisualizer";
import PlaylistView from "./scenes/search/playlistView";
import UserView from "./scenes/search/userView";

function App() {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const audioRef = useRef(null);

  const handleSetAudioElement = (el) => {
    audioRef.current = el;
    setIsAudioReady(true);
  };

  const renderMainView = () => {
    if (selectedPlaylistId) {
      return (
        <PlaylistView
          playlistId={selectedPlaylistId}
          onBack={() => setSelectedPlaylistId(null)}
          onTrackSelect={setSelectedTrackId}
        />
      );
    } else if (selectedUserId) {
      return (
        <UserView
          userId={selectedUserId}
          onBack={() => setSelectedUserId(null)}
        />
      );
    } else {
      return (
        <Search
          setSelectedTrackId={setSelectedTrackId}
          setSelectedPlaylistId={setSelectedPlaylistId}
          setSelectedUserId={setSelectedUserId}
        />
      );
    }
  };

  return (
    <>
      {renderMainView()}

      {selectedTrackId && (
        <>
          {isAudioReady && <AudioVisualizer audioRef={audioRef} />}
          <AudioPlayer
            trackId={selectedTrackId}
            audioRef={audioRef}
            setAudioElement={handleSetAudioElement}
          />
        </>
      )}
    </>
  );
}

export default App;
