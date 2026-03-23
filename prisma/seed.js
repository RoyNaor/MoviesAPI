import { getPrisma, connectDB, disconnectDB } from "../src/config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const PAGES_TO_FETCH = parseInt(process.env.SEED_PAGES || "5"); // 5 pages ≈ 100 movies

// ─── TMDB Fetchers ────────────────────────────────────────────────────────────

const fetchGenres = async () => {
  const res = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
  );
  const data = await res.json();
  return Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
};

const fetchPopularMovies = async (page) => {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  const data = await res.json();
  return data.results;
};

const fetchMovieDetails = async (tmdbId) => {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  return res.json();
};

// ─── System User ──────────────────────────────────────────────────────────────

const upsertSystemUser = async (prisma) => {
  const email = process.env.SYSTEM_USER_EMAIL;
  const password = process.env.SYSTEM_USER_PASSWORD;

  if (!email || !password) {
    throw new Error("SYSTEM_USER_EMAIL and SYSTEM_USER_PASSWORD must be set in .env");
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`✓ System user already exists (${existing.id})`);
    return existing;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "System",
      email,
      password: hashedPassword,
    },
  });

  console.log(`✓ System user created (${user.id})`);
  return user;
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

const seed = async () => {
  if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is not set in .env");

  await connectDB();
  const prisma = getPrisma();

  const systemUser = await upsertSystemUser(prisma);

  console.log("Fetching genre list from TMDB...");
  const genreMap = await fetchGenres();

  // Collect all movies across pages
  let rawMovies = [];
  for (let page = 1; page <= PAGES_TO_FETCH; page++) {
    console.log(`Fetching popular movies — page ${page}/${PAGES_TO_FETCH}...`);
    const results = await fetchPopularMovies(page);
    rawMovies = [...rawMovies, ...results];
  }

  console.log(`\nFetched ${rawMovies.length} movies total. Starting seed...\n`);

  let seeded = 0;
  let skipped = 0;

  for (const movie of rawMovies) {
    if (!movie.release_date) {
      skipped++;
      continue;
    }

    const releaseYear = new Date(movie.release_date).getFullYear();

    // Skip duplicates
    const exists = await prisma.movie.findFirst({
      where: { title: movie.title, releaseYear },
    });

    if (exists) {
      skipped++;
      continue;
    }

    // Fetch runtime from individual movie endpoint
    const details = await fetchMovieDetails(movie.id);

    await prisma.movie.create({
      data: {
        title: movie.title,
        overview: movie.overview || null,
        releaseYear,
        genre: movie.genre_ids.map((id) => genreMap[id]).filter(Boolean),
        runtime: details.runtime || null,
        poserUrl: movie.poster_path
          ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
          : null,
        createdBy: systemUser.id,
      },
    });

    console.log(`  ✓ ${movie.title} (${releaseYear})`);
    seeded++;
  }

  console.log(`\n🎬 Seed complete — seeded: ${seeded}, skipped: ${skipped}`);
  await disconnectDB();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
