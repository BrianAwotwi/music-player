import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const router = express.Router();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
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

// Step 1: Redirect user to Spotify authorization
router.get("/login", (req, res) => {
  const codeVerifier = generateRandomString(64); // Generate a new code_verifier
  const codeChallenge = base64urlEncode(sha256(codeVerifier)); // Generate code_challenge

  // Ensure session exists and store code_verifier
  req.session.codeVerifier = codeVerifier;

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  res.redirect(authUrl.toString());
});

// Step 2: Exchange authorization code for access token
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  // Retrieve code_verifier from session (MUST MATCH the one from /login)
  const codeVerifier = req.session.codeVerifier;
  if (!codeVerifier) {
    return res.status(400).json({ error: "Missing code_verifier in session" });
  }

  const url = "https://accounts.spotify.com/api/token";
  const payload = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier, // Use the stored code_verifier
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
    console.log("Spotify API Response:", data);

    if (data.access_token) {
      res.json({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      });
    } else {
      res.status(400).json({ error: "Failed to retrieve access token" });
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

  const url = "https://accounts.spotify.com/api/token";
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
    console.log("Spotify API Response:", data);

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
