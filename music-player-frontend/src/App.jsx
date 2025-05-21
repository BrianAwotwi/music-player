import { useState, useRef } from "react";
import Search from "./scenes/search/Search";
import AudioPlayer from "./scenes/audio-player/AudioPlayer";
import AudioVisualizer from "./scenes/audio-visualizer/audioVisualizer";
// import PlaylistView from "./scenes/search/playlistView";
// import UserView from "./scenes/search/userView";
import Sidebar from "./components/Sidebar";

function App() {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const audioRef = useRef(null);

  const handleSetAudioElement = (el) => {
    audioRef.current = el;
    setIsAudioReady(true);
  };

  // const renderMainView = () => {
  //   if (selectedPlaylistId) {
  //     return (
  //       <PlaylistView
  //         playlistId={selectedPlaylistId}
  //         onBack={() => setSelectedPlaylistId(null)}
  //         onTrackSelect={setSelectedTrackId}
  //       />
  //     );
  //   } else if (selectedUserId) {
  //     return (
  //       <UserView
  //         userId={selectedUserId}
  //         onBack={() => setSelectedUserId(null)}
  //       />
  //     );
  //   } else {
  //     return (
  //       <Search
  //         setSelectedTrackId={setSelectedTrackId}
  //         setSelectedPlaylistId={setSelectedPlaylistId}
  //         setSelectedUserId={setSelectedUserId}
  //       />
  //     );
  //   }
  // };

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden">
        {isAudioReady && <AudioVisualizer audioRef={audioRef} />}

        <div className="relative z-10">
          {/* {renderMainView()} */}

          {selectedTrackId && (
            <AudioPlayer
              trackId={selectedTrackId}
              audioRef={audioRef}
              setAudioElement={handleSetAudioElement}
            />
          )}
        </div>
      </div>
      <Sidebar
        setShowSearch={() => setShowSearch(true)}
        // setShowLibrary={showLibrary}
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
    </>
  );
}

export default App;
