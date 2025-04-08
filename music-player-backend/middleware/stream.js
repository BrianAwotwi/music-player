import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/stream/:trackId", async (req, res) => {
  const { trackId } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token in session" });
  }

  try {
    // Step 1: Get the redirect URL (temporary audio stream URL)
    const redirectResponse = await fetch(
      `https://api.soundcloud.com/tracks/${trackId}/stream`,
      {
        method: "GET",
        headers: {
          Authorization: `OAuth ${accessToken}`,
          Accept: "application/json; charset=utf-8",
        },
        redirect: "manual", // Don't follow automatically
      }
    );

    const redirectUrl = redirectResponse.headers.get("location");

    if (!redirectUrl) {
      return res.status(400).json({ error: "Could not retrieve stream URL" });
    }

    // Step 2: Stream the actual audio file
    const audioResponse = await fetch(redirectUrl);
    if (!audioResponse.ok) {
      return res
        .status(audioResponse.status)
        .json({ error: "Failed to stream audio" });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    audioResponse.body.pipe(res);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Stream proxy failed", details: err.message });
  }
});

export default router;
