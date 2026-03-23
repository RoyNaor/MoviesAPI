import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import movieRoute from "./routes/movie.route.js";
import authRoute from "./routes/auth.route.js";
import watchilstRoute from "./routes/watchlist.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/movie", movieRoute);
app.use("/watchlist", watchlistRoute);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async (signal, exitCode = 0) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    await disconnectDB();
    process.exit(exitCode);
  });
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  shutdown("unhandledRejection", 1);
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", () => shutdown("SIGTERM", 0));
process.on("SIGINT", () => shutdown("SIGINT", 0));
