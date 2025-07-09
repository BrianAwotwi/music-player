import { useEffect, useState, useRef, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import {
  IoPlay,
  IoPause,
  IoVolumeLow,
  IoVolumeMedium,
  IoVolumeHigh,
  IoVolumeMute,
  IoHeartOutline,
  IoPlaySkipForward,
  IoPlaySkipBack,
} from "react-icons/io5";
import { TfiLoop, TfiControlShuffle } from "react-icons/tfi";

import "./AudioPlayer.css";

export default function AudioPlayer({
  trackId,
  title,
  artist,
  artworkUrl,
  setAudioElement,
  audioRef,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const audioElementRef = useRef(new Audio());
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!trackId || !containerRef.current) return;

    const streamUrl = `http://localhost:8080/api/stream/${trackId}`;

    const setupWaveSurfer = async () => {
      try {
        const response = await fetch(streamUrl, {
          method: "HEAD",
          credentials: "include",
        });

        if (response.status === 401) {
          const data = await response.json();
          if (data.redirect) {
            window.location.href = `http://localhost:8080${data.redirect}`;
            return;
          }
        }

        if (!response.ok) {
          console.warn("Stream URL invalid:", response.status);
          return;
        }

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeAttribute("src");
          audioRef.current.load();
        }

        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }

        const ws = WaveSurfer.create({
          container: containerRef.current,
          media: audioElementRef.current,
          waveColor: "rgb(200, 0, 200)",
          progressColor: "rgb(100, 0, 100)",
          height: 50,
          barWidth: 2,
          barGap: 1,
          barRadius: 2,
          backend: "MediaElement",
          normalize: true,
          fetchParams: {
            credentials: "include",
          },
        });

        wavesurferRef.current = ws;

        ws.load(streamUrl);

        ws.on("ready", () => {
          setAudioElement(audioElementRef.current);
          ws.setVolume(isMuted ? 0 : volume);
          audioElementRef.current.loop = isRepeating;
          ws.play();
          setIsPlaying(true);
        });

        ws.on("play", () => setIsPlaying(true));
        ws.on("pause", () => setIsPlaying(false));
      } catch (err) {
        console.error("Stream error:", err);
      }
    };

    setupWaveSurfer();

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [trackId]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  const togglePlayPause = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleLikeTrack = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/liked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          trackId,
          title,
          artist,
          artworkUrl,
        }),
      });

      const data = await res.json();
      console.log("Like response:", data);
    } catch (err) {
      console.error("Failed to like track:", err);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleRepeat = () => {
    const audio = audioElementRef.current;
    if (audio) {
      const newRepeatState = !isRepeating;
      audio.loop = newRepeatState;
      setIsRepeating(newRepeatState);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <IoVolumeMute />;
    if (volume < 0.3) return <IoVolumeLow />;
    if (volume < 0.7) return <IoVolumeMedium />;
    return <IoVolumeHigh />;
  };

  if (!trackId) return null;

  return (
    <div className="audio-widget">
      <button>
        <IoPlaySkipBack />
      </button>

      <button onClick={togglePlayPause} className="text-2xl">
        {isPlaying ? <IoPause /> : <IoPlay />}
      </button>

      <button>
        <IoPlaySkipForward />
      </button>

      <button onClick={toggleMute} className="text-2xl">
        {getVolumeIcon()}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
      />

      <button>
        <TfiControlShuffle />
      </button>

      <button
        onClick={toggleRepeat}
        className={`repeat-button ${isRepeating ? "active" : ""}`}
        title={isRepeating ? "Repeat On" : "Repeat Off"}
      >
        <TfiLoop />
      </button>

      <div ref={containerRef} className="flex-1" />
      <button onClick={handleLikeTrack}>
        <IoHeartOutline />
      </button>
    </div>
  );
}
