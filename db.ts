import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_PUBLIC_URL;
    if (!mongoUrl) {
      throw new Error(
        "MONGO_PUBLIC_URL is not defined in the environment variables",
      );
    }
    await mongoose.connect(mongoUrl, {});
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
