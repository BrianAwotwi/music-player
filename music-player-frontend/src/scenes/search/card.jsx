import { FaUser, FaHeart } from "react-icons/fa";
import { IoPlay } from "react-icons/io5";

import "./Card.css";

const Card = ({ card, type, onClick }) => {
  const imageUrl = card.artwork_url || card.avatar_url || "img/music_ph.png";

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

  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <img src={imageUrl} alt={`${type} artwork`} />
      <div className="card-content">
        {type === "track" && (
          <>
            <h4>
              <strong>{card.title}</strong>
            </h4>
            <h4>{card.metadata_artist || "Artist unknown"}</h4>
            <h4>
              <IoPlay />
              {formatNumber(card.playback_count)} - {toHms(card.duration)}
            </h4>
          </>
        )}
        {type === "playlist" && (
          <>
            <h4>{card.title}</h4>
            <h4>{card.user.username}</h4>
            <h4>
              <FaHeart />
              {formatNumber(card.likes_count)} - {card.track_count} Tracks -{" "}
              {toHms(card.duration)}
            </h4>
          </>
        )}
        {type === "user" && (
          <>
            <h4>
              <strong>{card.username}</strong>
            </h4>
            <h4>{card.country || "Country unknown"}</h4>
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
