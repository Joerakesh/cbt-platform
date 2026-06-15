// Import mongoose package
import mongoose from "mongoose";

// Get MongoDB URL from environment file
const MONGODB_URI = process.env.MONGODB_URI!;

// Track connection status
let isConnected = false;

export async function connectDB() {
  // Stop reconnecting if already connected
  if (isConnected) return;

  try {
    // Connect MongoDB
    await mongoose.connect(MONGODB_URI);

    isConnected = true;

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Error:", error);
  }
}
