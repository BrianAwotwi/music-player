import { useState } from "react";
import Search from "./scenes/searchField";
import AudioPlayer from "./scenes/audioControls";

function App() {
  const [trackId, setTrackId] = useState(null);

  return (
    <>
      <Search setSelectedTrackId={setTrackId} />
      <AudioPlayer trackId={trackId} />
    </>
  );
}

export default App;
