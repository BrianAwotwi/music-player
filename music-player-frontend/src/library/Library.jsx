import { useState, useEffect } from "react";

import { IoChevronForwardOutline } from "react-icons/io5";
import { RiCloseLine } from "react-icons/ri";

import Card from "../scenes/search/Card";

import "./Library.css";

const Library = ({ onClose, open }) => {
  const [likedTracks, setLikedTracks] = useState([]);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [following, setFollowing] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/library/activity", {
          credentials: "include",
        });
        const data = await res.json();
        setLikedTracks(data.likedTracks || []);
        setMyPlaylists(data.myPlaylists || []);
        setFollowing(data.following || []);
        setHistory(data.playedTracks || []);
      } catch (err) {
        console.error("Failed to load library data:", err);
      }
    };

    if (open) fetchLibraryData();
  }, [open]);

  const fetchLikedTracks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/liked/tracks", {
        credentials: "include",
      });
      const data = await res.json();
      console.log("Liked tracks fetched:", data); // 👈 This is what you want to inspect
      setLikedTracks(data.likedTracks || []); // Adjust this based on actual shape
    } catch (err) {
      console.error("Failed to fetch liked tracks:", err);
    }
  };

  return (
    <div className={`library-container ${open ? "open" : ""}`}>
      <div className="close-button" onClick={onClose}>
        <RiCloseLine className="close-trigger" />
      </div>
      <div className="library-menus">
        <div className="library-menu">
          <h2>Liked Tracks</h2>
          <IoChevronForwardOutline onClick={fetchLikedTracks} />
        </div>
        <div className="library-menu">
          <h2>My Playlists</h2>
          <IoChevronForwardOutline />
        </div>
        <div className="library-menu">
          <h2>Following</h2>
          <IoChevronForwardOutline />
        </div>
        <div className="listening-history">
          <h2>Listening History</h2>
          <p
            onClick={async () => {
              await fetchPlayHistory();
              setOption("tracks");
            }}
          >
            See all
          </p>
          {history.slice(0, 3).map((track) => (
            <Card
              key={track.id}
              card={track}
              type="track"
              onClick={() => setSelectedTrackId(track.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
