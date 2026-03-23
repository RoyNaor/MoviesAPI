import movieService from "../services/movie.service.js";

export const getMovies = async (req, res) => {
  try {
    const { search, genre, page, limit } = req.query;
    const result = await movieService.getMovies({
      search,
      genre,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("getMovies error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    if (error.message === "Movie not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("getMovieById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createMovie = async (req, res) => {
  try {
    const movie = await movieService.createMovie(req.body, req.user.id);
    res.status(201).json(movie);
  } catch (error) {
    console.error("createMovie error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body, req.user.id);
    res.status(200).json(movie);
  } catch (error) {
    if (error.message === "Movie not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Not authorized") {
      return res.status(403).json({ message: error.message });
    }
    console.error("updateMovie error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    await movieService.deleteMovie(req.params.id, req.user.id);
    res.status(200).json({ message: "Movie deleted" });
  } catch (error) {
    if (error.message === "Movie not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Not authorized") {
      return res.status(403).json({ message: error.message });
    }
    console.error("deleteMovie error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
