import User from "../models/User.js";

export async function addPlayedTrack(req, res) {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: "Not logged in" });

  const { trackId, title, artist, artworkUrl } = req.body;

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          playedTracks: {
            trackId,
            title,
            artist,
            artworkUrl,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Track added to history" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add track", details: err.message });
  }
}
