import express from "express";
import { getWatchlist, addToWatchlist, updateWatchlistItem, removeFromWatchlist } from "../controllers/watchlist.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addToWatchlistSchema, updateWatchlistSchema } from "../schemas/watchlist.schema.js";

const router = express.Router();

router.use(protect);

router.get("/", getWatchlist);
router.post("/", validate(addToWatchlistSchema), addToWatchlist);
router.put("/:id", validate(updateWatchlistSchema), updateWatchlistItem);
router.delete("/:id", removeFromWatchlist);

export default router;
