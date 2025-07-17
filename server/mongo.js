import mongoose from "mongoose";
// URL -> "mongodb://0.0.0.0:27017/test"
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
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
