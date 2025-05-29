import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connectionString = process.env.CONNECTION_STRING;

    if (!connectionString) {
      throw new Error("MongoDB connection string is not defined in environment variables");
    }

    const connect = await mongoose.connect(connectionString);

    console.log("MongoDB connected:", connect.connection.host);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default dbConnect;
