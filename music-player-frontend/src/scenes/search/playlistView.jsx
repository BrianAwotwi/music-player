import { useEffect, useState } from "react";

import { AiTwotoneLike } from "react-icons/ai";
import { IoPlay } from "react-icons/io5";

import "./Card.css";

const PlaylistView = ({ playlistId, onBack, onTrackSelect }) => {
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const response = await fetch(
        `http://localhost:8080/api/search/playlist/${playlistId}`, // <-- singular 'playlist'
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      setPlaylist(data);
    };

    fetchPlaylist();
  }, [playlistId]);

  if (!playlist) return <p>Loading...</p>;

  const toHms = (duration) => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${hours > 0 ? hours + ":" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  function formatNumber(num) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      return num.toString();
    }
  }

  const daysAgo = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  return (
    <div className="playlist-view">
      <button onClick={onBack}>← Go Back</button>
      <h2>{playlist.title}</h2>
      <p>
        Playlist - {playlist.track_count} Tracks - Duration:{" "}
        {toHms(playlist.duration)} - Last modified:{" "}
        {daysAgo(playlist.last_modified)}
      </p>
      <p>
        <AiTwotoneLike /> {playlist.likes_count} Likes
      </p>
      <p>{playlist.description}</p>

      {playlist.tracks.map((track) => (
        <div
          className="card"
          key={track.id}
          onClick={() => onTrackSelect(track.id)}
        >
          <img src={track.artwork_url || "img/music_ph.png"} alt="Track" />
          <div className="card-content">
            <h4>
              <strong>{track.title}</strong>
            </h4>
            <h4>{track.metadata_artist || "Artist unknown"}</h4>
            <h4>
              <IoPlay />
              {formatNumber(track.playback_count)} - {toHms(track.duration)}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistView;
