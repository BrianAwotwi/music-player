import React from "react";

import { FaUser } from "react-icons/fa";

const Card = ({ card, type, onClick }) => {
  const imageUrl = card.artwork_url || card.avatar_url || "img/music_ph.png";

  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <img src={imageUrl} alt={`${type} artwork`} />
      <div>
        <h4>
          <strong>{card.title || card.username}</strong>
        </h4>
        {type === "track" && <h4>{card.metadata_artist}</h4>}
        {type === "playlist" && <h4>{card.owner}</h4>}
        {type === "user" && (
          <>
            <h4>{card.country}</h4>
            <p>
              <FaUser /> {card.followers_count} Followers
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
