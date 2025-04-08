import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const router = express.Router();

const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;
const redirectUri = process.env.SOUNDCLOUD_REDIRECT_URI;
const scope = "user-read-private user-read-email";

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

  const url = "https://api.soundcloud.com/oauth2/token";
  const payload = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    code,
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

    if (data.access_token) {
      // ✅ Store in session
      req.session.accessToken = data.access_token;

      // Optional: also store refresh token if you plan to use it
      req.session.refreshToken = data.refresh_token;

      // Redirect or respond
      res.redirect("http://localhost:5173"); // send user back to frontend
    } else {
      res
        .status(400)
        .json({ error: "Failed to retrieve access token", details: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Step 3: Refresh access token
router.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  const url = "https://secure.soundcloud.com/api/token";
  const payload = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refresh_token,
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

    if (data.access_token) {
      res.json({
        access_token: data.access_token,
        expires_in: data.expires_in,
      });
    } else {
      res.status(400).json({ error: "Failed to refresh access token" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;
