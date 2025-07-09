import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import crypto from "crypto";

import User from "../models/User.js";

dotenv.config();

const router = express.Router();

const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;
const redirectUri = process.env.SOUNDCLOUD_REDIRECT_URI;
const scope = "user-read-private user-read-email";

// const { id, username, avatar_url } = userData;

// let user = await User.findOne({ soundcloudId: id });

// if (!user) {
//   user = await User.create({
//     soundcloudId: id,
//     soundcloudUsername: username,
//     soundcloudAvatar: avatar_url,
//   });
// }

// req.session.userId = user._id;
// req.session.soundcloudId = id;

// Function to generate a random string (code_verifier)
const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map((x) => possible[x % possible.length])
    .join("");
};

// Function to generate SHA-256 hash
const sha256 = (plain) => crypto.createHash("sha256").update(plain).digest();

// Function to encode in Base64 URL format
const base64urlEncode = (buffer) =>
  buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

router.get("/", (req, res) => {
  res.send(
    "SoundCloud Authentication API - Available routes: /login, /callback, /refresh"
  );
});

// Step 1: Redirect user to SoundCloud authorization
router.get("/login", (req, res) => {
  const authUrl = new URL("https://soundcloud.com/connect");
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "non-expiring",
    display: "popup",
  });

  res.redirect(authUrl.toString());
});

// Step 2: Exchange authorization code for access token
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  const tokenUrl = "https://api.soundcloud.com/oauth2/token";
  const payload = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code,
  });

  try {
    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    });

    const tokenData = await tokenRes.json();
    console.log("SoundCloud token response:", tokenData);

    if (!tokenData.access_token) {
      return res
        .status(400)
        .json({ error: "Failed to get access token", details: tokenData });
    }

    req.session.accessToken = tokenData.access_token;
    req.session.refreshToken = tokenData.refresh_token;

    // ✅ Fetch SoundCloud user info
    const userRes = await fetch("https://api.soundcloud.com/me", {
      headers: {
        Authorization: `OAuth ${tokenData.access_token}`,
      },
    });

    const userData = await userRes.json();
    if (!userRes.ok) {
      return res
        .status(500)
        .json({ error: "Failed to fetch user info", details: userData });
    }

    const { id, username, avatar_url } = userData;

    // ✅ Find or create user in MongoDB
    let user = await User.findOne({ soundcloudId: id });

    if (!user) {
      user = await User.create({
        soundcloudId: id,
        soundcloudUsername: username,
        soundcloudAvatar: avatar_url,
      });
    }

    req.session.userId = user._id;
    req.session.soundcloudId = id;

    console.log("User logged in:", user.soundcloudUsername);

    res.redirect("http://localhost:5173"); // Your frontend URL
  } catch (err) {
    console.error("Callback error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// Step 3: Refresh access token
router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken || req.session.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  const url = "https://api.soundcloud.com/oauth2/token";
  const payload = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    });

    const data = await response.json();
    console.log("SoundCloud API Response:", data);

    if (!response.ok) {
      console.error("Refresh failed:", data);
      return res.status(500).json({ error: "Refresh failed", details: data });
    }

    // Save new tokens to session if provided
    if (data.access_token) req.session.accessToken = data.access_token;
    if (data.refresh_token) req.session.refreshToken = data.refresh_token;

    res.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (error) {
    console.error("Network or server error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;
