import mongoose from "mongoose";

const connectDB = async(): Promise<void> =>{
  try {
    await mongoose.connect(process.env.MONGO_URI || '')
    console.log('Database connected');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1)
  }
}

export default connectDB;