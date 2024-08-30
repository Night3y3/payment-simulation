import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";

  try {
    mongoose.connect(mongoURI);
    console.log("Connected to database successfully");
  } catch (error) {
    console.log(error);
    console.log("Could not connect database!");
  }
};

export default dbConnect;
