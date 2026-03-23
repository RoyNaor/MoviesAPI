import express from "express";
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "../controllers/movie.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createMovieSchema, updateMovieSchema } from "../schemas/movie.schema.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", protect, validate(createMovieSchema), createMovie);
router.put("/:id", protect, validate(updateMovieSchema), updateMovie);
router.delete("/:id", protect, deleteMovie);

export default router;
