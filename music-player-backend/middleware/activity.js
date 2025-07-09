import express from "express";
import fetch from "node-fetch";

import requireAuth from "./requireAuth.js";

const router = express.Router();

router.get("/activity", requireAuth, async (req, res) => {
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "No access token", redirect: "/api/auth/login" });
  }

  try {
    const response = await fetch("https://api.soundcloud.com/me/activities", {
      method: "GET",
      headers: {
        Authorization: `OAuth ${accessToken}`,
        Accept: "application/json; charset=utf-8",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch activity",
        details: await response.json(),
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching activity:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
