import mongoose from "mongoose";
// Replace with your MongoDB URI
const mongoURI = "mongodb://localhost:27017/APL";

export const dbConnection = async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
