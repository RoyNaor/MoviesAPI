import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma;

const getPrisma = () => {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }

    const adapter = new PrismaPg({ connectionString });

    prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  return prisma;
};

const connectDB = async () => {
  try {
    await getPrisma().$connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    if (!prisma) {
      return;
    }

    await prisma.$disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.error("Database disconnection error:", error);
  }
};

export { connectDB, disconnectDB, getPrisma };
