import watchlistService from "../services/watchlist.service.js";

export const getWatchlist = async (req, res) => {
  try {
    const items = await watchlistService.getWatchlist(req.user.id);
    res.status(200).json(items);
  } catch (error) {
    console.error("getWatchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const item = await watchlistService.addToWatchlist(req.user.id, req.body);
    res.status(201).json(item);
  } catch (error) {
    if (error.message === "Movie already in watchlist") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Movie not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("addToWatchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateWatchlistItem = async (req, res) => {
  try {
    const item = await watchlistService.updateWatchlistItem(req.params.id, req.user.id, req.body);
    res.status(200).json(item);
  } catch (error) {
    if (error.message === "Watchlist item not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Not authorized") {
      return res.status(403).json({ message: error.message });
    }
    console.error("updateWatchlistItem error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    await watchlistService.removeFromWatchlist(req.params.id, req.user.id);
    res.status(200).json({ message: "Removed from watchlist" });
  } catch (error) {
    if (error.message === "Watchlist item not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Not authorized") {
      return res.status(403).json({ message: error.message });
    }
    console.error("$õmoveFromWatchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
