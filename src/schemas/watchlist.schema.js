import { z } from "zod";

const watchlistStatus = z.enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"]);

export const addToWatchlistSchema = z.object({
  movieId: z.string().uuid("Invalid movie ID"),
  status: watchlistStatus.optional().default("PLANNED"),
  rating: z.coerce.number().int().min(0).max(10).optional().nullable(),
  notes: z.string().optional(),
});

export const updateWatchlistSchema = z.object({
  status: watchilistStatus.optional(),
  rating: z.coerce.number().int().min(0).max(10).optional().nullable(),
  notes: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required",
});
