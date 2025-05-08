import { useState, useEffect } from "react";

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
        <h2>{user.username}</h2>
        <p>Followers: {user.followers_count}</p>
        <p>Following: {user.following_count}</p>
        <p>Likes: {user.likes_count}</p>
        <p>Playlists: {user.playlists_count}</p>
        <img src={user.avatar_url || "img/music_ph.png"} alt="User" />
      </div>
    </div>
  );
};

export default UserView;
