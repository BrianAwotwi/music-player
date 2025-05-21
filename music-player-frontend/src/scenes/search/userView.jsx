import { useState, useEffect } from "react";

import "./UserView.css";

const UserView = ({ userId, onBack }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:8080/api/search/user/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log("Fetched User Data:", data);
      setUser(data);
    };

    fetchUser();
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-view">
      <button onClick={onBack}>← Go Back</button>
      <div className="user-card">
        <img src={user.avatar_url || "img/user_ph.png"} alt="User" />
        <h2>{user.username}</h2>
        <p>{user.country || "Country unknown"}</p>
        <p>{user.description || "No description available"}</p>
        <p>Followers: {user.followers_count}</p>
        <p>Following: {user.followings_count}</p>
        <p>Likes: {user.likes_count}</p>
        <p>Playlists: {user.playlist_count}</p>
      </div>
    </div>
  );
};

export default UserView;
