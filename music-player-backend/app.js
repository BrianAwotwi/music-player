import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./middleware/auth.js";
import streamRoutes from "./middleware/stream.js";
import searchRoutes from "./middleware/search.js";
import session from "express-session";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON request bodies

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);

app.use("/api", streamRoutes);

app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
