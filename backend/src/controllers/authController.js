import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { success, error } from "../helper/responseHelper.js";

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //  Validate required fields
    if (!name) return error(res, "Name is required");
    if (!email) return error(res, "Email is required");
    if (!password) return error(res, "Password is required");
    if (!role) return error(res, "Role is required");

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return error(res, "Email already registered");

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    success(res, "Registered successfully", user);
  } catch (err) {
    error(res, err.message);
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return error(res, "User not found", 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(res, "Incorrect password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    success(res, "Login successful", { user, token });
  } catch (err) {
    error(res, err.message, 500);
  }
};

// Get profile
export const getProfile = (req, res) => {
  success(res, "Profile fetched", req.user);
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    success(res, "Profile updated", user);
  } catch (err) {
    error(res, err.message);
  }
};

// Block/unblock user
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, "User not found", 404);
    user.isBlocked = !user.isBlocked;
    await user.save();
    success(res, `User ${user.isBlocked ? "blocked" : "unblocked"}`, user);
  } catch (err) {
    error(res, err.message);
  }
};
