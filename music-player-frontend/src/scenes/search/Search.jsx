import { useState } from "react";
import Card from "./card";
import PlaylistView from "./playlistView";
import UserView from "./userView";
import { RiCloseLine } from "react-icons/ri";

import "./Search.css";

const Search = ({
  setSelectedTrackId,
  setSelectedPlaylistId,
  setSelectedUserId,
  onClose,
  open,
}) => {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("search");
  const [playlistId, setPlaylistId] = useState(null);
  const [userId, setUserId] = useState(null);

  const [option, setOption] = useState("all"); // "all", "tracks", "playlists", "users"

  const handleSearch = async (term) => {
    const url = `http://localhost:8080/api/search/all/${encodeURIComponent(
      term
    )}`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (response.status === 401 && data.redirect) {
      window.location.href = `http://localhost:8080${data.redirect}`;
      return;
    }

    setTracks(data.tracks || []);
    setPlaylists(data.playlists || []);
    setUsers(data.users || []);
  };

  const fetchCategory = async (type, term) => {
    const url = `http://localhost:8080/api/search/${type}/${encodeURIComponent(
      term
    )}`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (response.status === 401 && data.redirect) {
      window.location.href = `http://localhost:8080${data.redirect}`;
      return;
    }

    if (type === "tracks") setTracks(data.tracks || []);
    else if (type === "playlists") setPlaylists(data.playlists || []);
    else if (type === "users") setUsers(data.users || []);

    console.log(`Fetched ${type}:`, data);
  };

  const renderExpandedPlaylists = () =>
    playlists.map((playlist) => (
      <div key={playlist.id}>
        <Card
          card={playlist}
          type="playlist"
          onClick={() =>
            setExpandedPlaylists((prev) =>
              prev === playlist.id ? null : playlist.id
            )
          }
        />
        {expandedPlaylists === playlist.id &&
          playlist.tracks?.map((track) => (
            <Card
              key={track.id}
              card={track}
              type="track"
              onClick={() => setSelectedTrackId(track.id)}
            />
          ))}
      </div>
    ));

  const renderUserProfiles = () =>
    users.map((user) => (
      <Card
        key={user.id}
        card={user}
        type="user"
        onClick={() => {
          setUserId(user.id);
          setView("userView");
        }}
      />
    ));

  const renderResults = () => {
    if (view !== "search") return null;

    return (
      <div className="results visible">
        {option === "all" && (
          <>
            <h2>Tracks</h2>
            <p
              onClick={async () => {
                await fetchCategory("tracks", searchTerm);
                setOption("tracks");
              }}
            >
              See all
            </p>
            {tracks.slice(0, 3).map((track) => (
              <Card
                key={track.id}
                card={track}
                type="track"
                onClick={() => setSelectedTrackId(track.id)}
              />
            ))}

            <h2>Playlists</h2>
            <p
              onClick={async () => {
                await fetchCategory("playlists", searchTerm);
                setOption("playlists");
              }}
            >
              See all
            </p>
            {playlists.slice(0, 3).map((playlist) => (
              <Card
                key={playlist.id}
                card={playlist}
                type="playlist"
                onClick={() => {
                  setPlaylistId(playlist.id);
                  setView("playlistView");
                }}
              />
            ))}

            <h2>Users</h2>
            <p
              onClick={async () => {
                await fetchCategory("users", searchTerm);
                setOption("users");
              }}
            >
              See all
            </p>
            {users.slice(0, 3).map((user) => (
              <Card
                key={user.id}
                card={user}
                type="user"
                onClick={() => {
                  setUserId(user.id);
                  setView("userView");
                }}
              />
            ))}
          </>
        )}

        {option === "tracks" && (
          <>
            <button onClick={() => setOption("all")}>
              ← Back to Search Results
            </button>
            {tracks.map((track) => (
              <Card
                key={track.id}
                card={track}
                type="track"
                onClick={() => setSelectedTrackId(track.id)}
              />
            ))}
          </>
        )}

        {option === "playlists" && (
          <>
            <button onClick={() => setOption("all")}>
              ← Back to Search Results
            </button>
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                card={playlist}
                type="playlist"
                onClick={() => {
                  setPlaylistId(playlist.id);
                  setView("playlistView");
                }}
              />
            ))}
          </>
        )}

        {option === "users" && (
          <>
            <button onClick={() => setOption("all")}>
              ← Back to Search Results
            </button>
            {renderUserProfiles()}
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`search-container ${open ? "open" : ""}`}>
      <div className="search-bar">
        <div className="input-with-button">
          <input
            placeholder="Search for tracks, playlists, or users..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleSearch(searchTerm);
                setOption("all");
              }
            }}
          />
          <div className="close-button" onClick={onClose}>
            <RiCloseLine className="close-trigger" />
          </div>
        </div>
      </div>

      {searchTerm && (
        <div className="search-options">
          <ul>
            <li
              onClick={async () => {
                await handleSearch(searchTerm);
                setOption("all");
              }}
            >
              All
            </li>
            <li
              onClick={async () => {
                await fetchCategory("tracks", searchTerm);
                setOption("tracks");
              }}
            >
              Tracks
            </li>
            <li
              onClick={async () => {
                await fetchCategory("playlists", searchTerm);
                setOption("playlists");
              }}
            >
              Playlists
            </li>
            <li
              onClick={async () => {
                await fetchCategory("users", searchTerm);
                setOption("users");
              }}
            >
              Users
            </li>
          </ul>
        </div>
      )}

      {renderResults()}

      <div
        className={`results ${
          view === "playlistView" || view === "userView" ? "visible" : ""
        }`}
      >
        {view === "playlistView" && playlistId && (
          <PlaylistView
            playlistId={playlistId}
            onBack={() => {
              setPlaylistId(null);
              setView("search");
            }}
            onTrackSelect={(trackId) => {
              setSelectedTrackId(trackId);
            }}
          />
        )}
        {view === "userView" && userId && (
          <UserView
            userId={userId}
            onBack={() => {
              setUserId(null);
              setView("search");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
