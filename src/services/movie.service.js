import { getPrisma } from "../config/db.js";

const getMovies = async ({ search, genre, page = 1, limit = 20 }) => {
  const prisma = getPrisma();
  const skip = (page - 1) * limit;

  const where = {
    ...(search && { title: { contains: search, mode: "insensitive" } }),
    ...(genre && { genre: { has: genre } }),
  };

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.movie.count({ where }),
  ]);

  return { movies, total, page, limit };
};

const getMovieById = async (id) => {
  const prisma = getPrisma();
  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) throw new Error("Movie not found");
  return movie;
};

const createMovie = async (data, userId) => {
  const prisma = getPrisma();
  const { title, overview, releaseYear, genre, runtime, poserUrl } = data;

  return prisma.movie.create({
    data: { title, overview, releaseYear, genre, runtime, poserUrl, createdBy: userId },
  });
};

const updateMovie = async (id, data, userId) => {
  const prisma = getPrisma();
  const movie = await prisma.movie.findUnique({ where: { id } });

  if (!movie) throw new Error("Movie not found");
  if (movie.createdBy !== userId) throw new Error("Not authorized");

  return prisma.movie.update({ where: { id }, data });
};

const deleteMovie = async (id, userId) => {
  const prisma = getPrisma();
  const movie = await prisma.movie.findUnique({ where: { id } });

  if (!movie) throw new Error("Movie not found");
  if (movie.createdBy !== userId) throw new Error("Not authorized");

  await prisma.movie.delete({ where: { id } });
};

export default { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
