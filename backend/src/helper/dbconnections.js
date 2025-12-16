import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    console.log("Mongo URL:", process.env.MONGO_URL);

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ DB Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
