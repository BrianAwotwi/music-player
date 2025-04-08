import { useState } from "react";

const Search = () => {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getQuery = async (term) => {
    const response = await fetch(
      `https://api.soundcloud.com/tracks?q=${encodeURIComponent(
        term
      )}&type=track`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 2-302046-1537117888-9mv5tN5xIna5g",
        },
      }
    );

    const data = await response.json();
    setSongs(data.tracks?.items || []);
    console.log(data);
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
            <div key={track.id}>
              <p>
                {track.name} - {track.artists[0].name}
              </p>
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
