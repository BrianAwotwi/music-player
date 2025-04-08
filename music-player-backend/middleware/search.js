import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "No access token in session" });
  }

  try {
    const getSearchResults = await fetch(
      `https://api.soundcloud.com/tracks?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `OAuth ${accessToken}`,
          Accept: "application/json; charset=utf-8",
        },
      }
    );

    const data = await getSearchResults.json();

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "No search results found" });
    }

    res.json({ tracks: data });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Search proxy failed", details: err.message });
  }
});

export default router;
