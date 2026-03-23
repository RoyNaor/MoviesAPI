import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  overview: z.string().optional(),
  releaseYear: z.coerce.number().int().min(1888, "Invalid release year").max(new Date().getFullYear() + 5),
  genre: z.array(z.string()).optional().default([]),
  runtime: z.coerce.number().int().positive().optional(),
  poserUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const updateMovieSchema = z.object({
  title: z.string().min(1).optional(),
  overview: z.string().optional(),
  releaseYear: z.coerce.number().int().min(1888).max(new Date().getFullYear() + 5).optional(),
  genre: z.array(z.string()).optional(),
  runtime: z.coerce.number().int().positive().optional().nullable(),
  poserUrl: z.string().url("Invalid URL").optional().nullable(),
});
