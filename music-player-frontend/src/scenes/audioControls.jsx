import { useEffect, useState } from "react";
import { Howl } from "howler";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const streamUrl = "http://localhost:8080/api/stream/807590698";

    const howl = new Howl({
      src: [streamUrl],
      format: ["mp3"],
      html5: true,
    });

    setSound(howl);
  }, []);

  const togglePlay = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
    setIsPlaying(!isPlaying);
  };

  return <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>;
}
