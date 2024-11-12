import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected");
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
