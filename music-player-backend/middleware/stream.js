import express from "express";
import fetch from "node-fetch";

import requireAuth from "./requireAuth.js";

const router = express.Router();

router.get("/stream/:trackId", requireAuth, async (req, res) => {
  const { trackId } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "No access token", redirect: "/api/auth/login" });
  }

  try {
    // Step 1: Get redirect URL to actual audio stream
    const redirectResponse = await fetch(
      `https://api.soundcloud.com/tracks/${trackId}/stream`,
      {
        method: "GET",
        headers: {
          Authorization: `OAuth ${accessToken}`,
          Accept: "application/json; charset=utf-8",
        },
        redirect: "manual",
      }
    );

    // 👇 Handle expired/invalid token from SoundCloud
    if (redirectResponse.status === 401) {
      return res
        .status(401)
        .json({ error: "Access token expired", redirect: "/api/auth/login" });
    }

    const redirectUrl = redirectResponse.headers.get("location");
    if (!redirectUrl) {
      return res.status(400).json({ error: "Could not retrieve stream URL" });
    }

    // Step 2: Stream the actual audio
    const audioResponse = await fetch(redirectUrl);
    if (!audioResponse.ok) {
      return res
        .status(audioResponse.status)
        .json({ error: "Failed to stream audio" });
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Credentials": "true",
      "Cross-Origin-Resource-Policy": "cross-origin",
    });

    audioResponse.body.pipe(res);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Stream proxy failed", details: err.message });
  }
});

export default router;
