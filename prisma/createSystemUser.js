import { getPrisma, connectDB, disconnectDB } from "../src/config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const createSystemUser = async () => {
  const email = process.env.SYSTEM_USER_EMAIL;
  const password = process.env.SYSTEM_USER_PASSWORD;

  if (!email || !password) {
    throw new Error("SYSTEM_USER_EMAIL and SYSTEM_USER_PASSWORD must be set in .env");
  }

  await connectDB();
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`✓ System user already exists — id: ${existing.id}`);
    await disconnectDB();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "System",
      email,
      password: hashedPassword,
    },
  });

  console.log(`✓ System user created — id: ${user.id}`);
  await disconnectDB();
};

createSystemUser().catch((err) => {
  console.error("Failed to create system user:", err);
  process.exit(1);
});
