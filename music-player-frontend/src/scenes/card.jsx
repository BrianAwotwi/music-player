import React from "react";

const Card = ({ card }) => {
  return (
    <div className="card">
      <div>
        <img
          src={card.artwork_url !== "" ? card.artwork_url : "img/music_ph.png"}
          alt="Card artwork"
        />
        <div>
          <h4>
            <strong>{card.title}</strong>
          </h4>
          <h4>{card.metadata_artist}</h4>
        </div>
      </div>
    </div>
  );
};

export default Card;
