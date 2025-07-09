import User from "../models/User.js";

export async function addLikedTrack(req, res) {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: "Not logged in" });

  const { trackId, title, artist, artworkUrl } = req.body;

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          likedTracks: { trackId, title, artist, artworkUrl },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Track added to liked" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add track", details: err.message });
  }
}

export async function removeLikedTrack(req, res) {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: "Not logged in" });

  const { trackId } = req.body;

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          likedTracks: { trackId }, // remove the track that matches this trackId
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Track removed from liked" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to remove track", details: err.message });
  }
}
