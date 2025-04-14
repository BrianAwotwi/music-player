import { useState } from "react";
import Card from "./card";

const Search = ({ setSelectedTrackId }) => {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getQuery = async (term) => {
    const response = await fetch(
      `http://localhost:8080/api/search/${encodeURIComponent(term)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json(); // ✅ Only call this once

    if (response.status === 401) {
      if (data.redirect) {
        window.location.href = `http://localhost:8080${data.redirect}`;
      }
      return; // ⛔ Don't continue if unauthorized
    }

    setSongs(data.tracks || []);
  };

  return (
    <div className="search-bar">
      <input
        placeholder="Search for tracks"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            getQuery(searchTerm);
          }
        }}
      />

      {songs.length > 0 ? (
        <div className="results">
          {songs.map((track) => (
            <div key={track.id} onClick={() => setSelectedTrackId(track.id)}>
              <Card card={track} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>No tracks found</h2>
        </div>
      )}
    </div>
  );
};

export default Search;
