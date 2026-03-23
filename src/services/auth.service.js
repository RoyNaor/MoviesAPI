import { getPrisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const registerUser = async ({ name, email, password }) => {
  const prisma = getPrisma();

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return {
    token: generateToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  };
};

const login = async ({ email, password }) => {
  const prisma = getPrisma();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  return {
    token: generateToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export default { registerUser, login };
