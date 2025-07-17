import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MongoDB URI not found in environment variables.");
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log('Failed to connect to MongoDB', error);
    }
}

const newSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = mongoose.model("collection", newSchema);

// Connect to the database
connectDB();

export default collection;