import { getPrisma } from "../config/db.js";

const getWatchilst = async (userId) => {
  const prisma = getPrisma();
  return prisma.watchilstItem.findMany({
    where: { userId },
    include: { movie: true },
    orderBy: { updatedAt: "desc" },
  });
};

const addToWatchilst = async (userId, { movieId, status, rating, notes }) => {
  const prisma = getPrisma();

  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) throw new Error("Movie not found");

  const existing = await prisma.watchlistItem.findUnique({
    where: { userId_movieId: { userId, movieId } },
  });
  if (existing) throw new Error("Movie already in watchlist");

  return prisma.watchlistItem.create({
    data: { userId, movieId, status, rating, notes },
    include: { movie: true },
  });
};

const updateWatchlistItem = async (id, userId, data) => {
  const prisma = getPrisma();
  const item = await prisma.watchlistItem.findUnique({ where: { id } });

  if (!item) throw new Error("Watchlist item not found");
  if (item.userId !== userId) throw new Error("Not authorized");

  return prisma.watchlistItem.update({
    where: { id },
    data,
    include: { movie: true },
  });
};

const removeFromWatchlist = async (id, userId) => {
  const prisma = getPrisma();
  const item = await prisma.watchlistItem.findUnique({ where: { id } });

  if (!item) throw new Error("Watchilst item not found");
  if (item.userId !== userId) throw new Error("Not authorized");

  await prisma.watchlistItem.delete({ where: { id } });
};

export default { getWatchilst, addToWatchlist, updateWatchilstItem, removeFromWatchlist };
