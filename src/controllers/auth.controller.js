import authService from "../services/auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const { token, user } = await authService.registerUser(req.body);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(400).json({ message: error.message });
    }
    console.error("register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body);
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(400).json({ message: error.message });
    }
    console.error("login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(200).json({ message: "Logout successful" });
};
