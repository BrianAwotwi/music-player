import { useState } from "react";
import Card from "./card";

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
  const [usersOption, setUsersOption] = useState(false);
  const [allOption, setAllOption] = useState(false);
  const [playlistsOption, setPlaylistsOption] = useState(false);
  const [tracksOption, setTracksOption] = useState(false);
  const [expandedPlaylists, setExpandedPlaylists] = useState(null);
  const [closeMenu, setCloseMenu] = useState(false);

  const getAll = async (term) => {
    const response = await fetch(
      `http://localhost:8080/api/search/all/${encodeURIComponent(term)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.status === 401 && data.redirect) {
      window.location.href = `http://localhost:8080${data.redirect}`;
      return;
    }

    console.log("All Results:", data);
    setTracks(data.tracks || []);
    setPlaylists(data.playlists || []);
    setUsers(data.users || []);
  };

  const getTracks = async (term) => {
    const response = await fetch(
      `http://localhost:8080/api/search/tracks/${encodeURIComponent(term)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.status === 401 && data.redirect) {
      window.location.href = `http://localhost:8080${data.redirect}`;
      return;
    }

    console.log("Tracks:", data);
    setTracks(data.tracks || []);
  };

  const getPlaylists = async (term) => {
    const response = await fetch(
      `http://localhost:8080/api/search/playlists/${encodeURIComponent(term)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.status === 401 && data.redirect) {
      window.location.href = `http://localhost:8080${data.redirect}`;
      return;
    }

    console.log("Playlists:", data);
    setPlaylists(data.playlists || []);
  };

  const getUsers = async (term) => {
    const response = await fetch(
      `http://localhost:8080/api/search/users/${encodeURIComponent(term)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.status === 401 && data.redirect) {
      window.location.href = `http://localhost:8080${data.redirect}`;
      return;
    }

    console.log("Users:", data);
    console.log(data.users[0].city);
    setUsers(data.users || []);
  };

  const handlePlaylistClick = (playlistId) => {
    setExpandedPlaylists((prev) => (prev === playlistId ? null : playlistId));
  };

  const renderExpandedPlaylists = () => {
    return playlists.map((playlist) => (
      <div key={playlist.id}>
        <Card
          card={playlist}
          type="playlist"
          onClick={() => handlePlaylistClick(playlist.id)}
        />
        {expandedPlaylists === playlist.id && playlist.tracks && (
          <div className="playlist-tracks">
            {playlist.tracks.map((track) => (
              <Card
                key={track.id}
                card={track}
                type="track"
                onClick={() => setSelectedTrackId(track.id)}
              />
            ))}
          </div>
        )}
      </div>
    ));
  };

  const renderUserProfile = () => {
    return users.map((user) => (
      <div key={user.id}>
        <Card
          card={user}
          type="user"
          onClick={() => setSelectedUserId(user.id)}
        />
      </div>
    ));
  };

  const handleBackToAll = () => {
    setAllOption(true);
    setTracksOption(false);
    setPlaylistsOption(false);
    setUsersOption(false);
  };

  const handleAllOption = () => {
    setAllOption(true);
    setTracksOption(false);
    setPlaylistsOption(false);
    setUsersOption(false);
  };

  const handleTracksOption = () => {
    setTracksOption(true);
    setPlaylistsOption(false);
    setUsersOption(false);
    setAllOption(false);
  };

  const handlePlaylistsOption = () => {
    setPlaylistsOption(true);
    setTracksOption(false);
    setUsersOption(false);
    setAllOption(false);
  };

  const handleUsersOption = () => {
    setUsersOption(true);
    setTracksOption(false);
    setPlaylistsOption(false);
    setAllOption(false);
  };

  const handleCloseMenu = () => {
    onClose();
  };

  return (
    <div className={`search-container ${open ? "open" : ""}`}>
      {/* <p>Search for your favorite tracks and play them instantly!</p> */}
      <div className="search-bar">
        <div className="input-with-button">
          <input
            placeholder="Search for tracks, playlists, or users..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") getAll(searchTerm);
              handleAllOption();
            }}
          />
          <div className="close-button" onClick={handleCloseMenu}>
            <RiCloseLine className="close-trigger" />
          </div>
        </div>
      </div>

      {searchTerm && (
        <div className="search-options">
          <ul>
            <li
              onClick={() => {
                getAll(searchTerm);
                handleAllOption();
              }}
            >
              All
            </li>
            <li
              onClick={() => {
                getTracks(searchTerm);
                handleTracksOption();
              }}
            >
              Tracks
            </li>
            <li
              onClick={() => {
                getPlaylists(searchTerm);
                handlePlaylistsOption();
              }}
            >
              Playlists
            </li>
            <li
              onClick={() => {
                getUsers(searchTerm);
                handleUsersOption();
              }}
            >
              Users
            </li>
          </ul>
        </div>
      )}

      <div
        className={`results ${
          allOption || tracksOption || playlistsOption || usersOption
            ? "visible"
            : ""
        }`}
      >
        {/* shows the first 3 results from all categories on initial search or if "All" option is selected; also include the option to "see more" or "see all" */}
        {allOption && (
          <>
            <h2>Tracks</h2>
            <p
              onClick={() => {
                getTracks(searchTerm);
                handleTracksOption(); // 👈 sets view to tracks only
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
              onClick={() => {
                getPlaylists(searchTerm);
                handlePlaylistsOption(); // 👈 sets view to playlists only
              }}
            >
              See all
            </p>
            {playlists.slice(0, 3).map((playlist) => (
              <Card
                key={playlist.id}
                card={playlist}
                type="playlist"
                onClick={() => setSelectedPlaylistId(playlist.id)}
              />
            ))}

            <h2>Users</h2>
            <p
              onClick={() => {
                getUsers(searchTerm);
                handleUsersOption(); // 👈 sets view to users only
              }}
            >
              See all
            </p>
            {users.slice(0, 3).map((user) => (
              <Card
                key={user.id}
                card={user}
                type="user"
                onClick={() => setSelectedUserId(user.id)}
              />
            ))}
          </>
        )}

        {/* conditional render on tracks*/}
        {tracksOption && (
          <>
            <button onClick={handleBackToAll}>← Back to Search Results</button>
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
        {/* conditional render on playlists*/}
        {playlistsOption && (
          <>
            <button onClick={handleBackToAll}>← Back to Search Results</button>
            {renderExpandedPlaylists()}
          </>
        )}

        {/* conditional render on users*/}
        {usersOption && (
          <>
            <button onClick={handleBackToAll}>← Back to Search Results</button>
            {renderUserProfile()}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
