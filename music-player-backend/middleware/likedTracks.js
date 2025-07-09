import express from "express";
import { addLikedTrack, removeLikedTrack } from "../controllers/likedTracks.js";
import User from "../models/User.js"; // Add this import

const router = express.Router();

router.post("/", addLikedTrack);
router.delete("/", removeLikedTrack);

// New route to fetch liked tracks
router.get("/", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: "Not logged in" });

  try {
    const user = await User.findById(userId, "likedTracks");
    res.status(200).json(user.likedTracks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch liked tracks" });
  }
});

export default router;
