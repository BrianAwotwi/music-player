import express from "express";
import { addPlayedTrack } from "../controllers/history.js";

const router = express.Router();

router.post("/played", addPlayedTrack);

export default router;
