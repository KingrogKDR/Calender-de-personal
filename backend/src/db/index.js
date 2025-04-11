import mongoose from "mongoose";

const DB_NAME = "calendar"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB CONNECTED: ${conn.connection.host}`)
    } catch (error) {
        console.error(`MongoDB connection FAILED: ${error}`);
        throw error;
    }
}

export default connectDB;