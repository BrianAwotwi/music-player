import express from "express";
import fetch from "node-fetch";
import requireAuth from "./requireAuth.js";

const router = express.Router();

// Utility function to fetch from SoundCloud
async function fetchFromSoundCloud(type, query, accessToken) {
  const response = await fetch(
    `https://api.soundcloud.com/${type}?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `OAuth ${accessToken}`,
        Accept: "application/json; charset=utf-8",
      },
    }
  );

  if (response.status === 401) {
    throw new Error("unauthorized");
  }

  const data = await response.json();
  if (!data || !Array.isArray(data)) {
    throw new Error(`No ${type} results found`);
  }

  console.log(`Fetched ${type}:`, data.slice(0, 3)); // Log first 3 results
  return data;
}

// GET /tracks/:query
router.get("/tracks/:query", requireAuth, async (req, res) => {
  const { query } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token" });
  }

  try {
    const tracks = await fetchFromSoundCloud("tracks", query, accessToken);
    res.json({ tracks });
  } catch (err) {
    if (err.message === "unauthorized") {
      return res
        .status(401)
        .json({ error: "Access token expired", redirect: "/api/auth/login" });
    }
    res
      .status(500)
      .json({ error: "Tracks fetch failed", details: err.message });
  }
});

// GET /playlists/:query
router.get("/playlists/:query", requireAuth, async (req, res) => {
  const { query } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token" });
  }

  try {
    const playlists = await fetchFromSoundCloud(
      "playlists",
      query,
      accessToken
    );
    res.json({ playlists });
  } catch (err) {
    if (err.message === "unauthorized") {
      return res
        .status(401)
        .json({ error: "Access token expired", redirect: "/api/auth/login" });
    }
    res
      .status(500)
      .json({ error: "Playlists fetch failed", details: err.message });
  }
});

router.get("/playlist/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token" });
  }

  try {
    const response = await fetch(`https://api.soundcloud.com/playlists/${id}`, {
      headers: {
        Authorization: `OAuth ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      return res
        .status(401)
        .json({ error: "Access token expired", redirect: "/api/auth/login" });
    }

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Playlist not found", details: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch playlist", details: err.message });
  }
});

// GET /users/:query
router.get("/users/:query", requireAuth, async (req, res) => {
  const { query } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token" });
  }

  try {
    const users = await fetchFromSoundCloud("users", query, accessToken);
    res.json({ users });
  } catch (err) {
    if (err.message === "unauthorized") {
      return res
        .status(401)
        .json({ error: "Access token expired", redirect: "/api/auth/login" });
    }
    res.status(500).json({ error: "Users fetch failed", details: err.message });
  }
});

router.get("/user/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token" });
  }

  try {
    const response = await fetch(`https://api.soundcloud.com/users/${id}`, {
      headers: {
        Authorization: `OAuth ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      return res
        .status(401)
        .json({ error: "Access token expired", redirect: "/api/auth/login" });
    }

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "User not found", details: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch user", details: err.message });
  }
});

// GET /all/:query – fetches tracks, playlists, and users in one call
router.get("/all/:query", requireAuth, async (req, res) => {
  const { query } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "No access token", redirect: "/api/auth/login" });
  }

  try {
    const [tracksRes, playlistsRes, usersRes] = await Promise.all([
      fetch(
        `https://api.soundcloud.com/tracks?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `OAuth ${accessToken}`,
            Accept: "application/json",
          },
        }
      ),
      fetch(
        `https://api.soundcloud.com/playlists?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `OAuth ${accessToken}`,
            Accept: "application/json",
          },
        }
      ),
      fetch(`https://api.soundcloud.com/users?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `OAuth ${accessToken}`,
          Accept: "application/json",
        },
      }),
    ]);

    if (
      tracksRes.status === 401 ||
      playlistsRes.status === 401 ||
      usersRes.status === 401
    ) {
      return res.status(401).json({
        error: "Access token expired",
        redirect: "/api/auth/login",
      });
    }

    // ✅ Wait for the JSON before slicing
    const [tracksJson, playlistsJson, usersJson] = await Promise.all([
      tracksRes.json(),
      playlistsRes.json(),
      usersRes.json(),
    ]);

    const tracks = tracksJson.slice(0, 3);
    const playlists = playlistsJson.slice(0, 3);
    const users = usersJson.slice(0, 3);

    res.json({ tracks, playlists, users });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch combined search results",
      details: err.message,
    });
  }
});

export default router;
