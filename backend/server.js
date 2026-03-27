import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js'
import userRoutes from './routes/user.routes.js'
import messgeRoutes from './routes/message.routes.js'
import path from "path";
import { fileURLToPath } from "url";
import redisClient from './redis/redisClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




dotenv.config();
const app =  express();
app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(messgeRoutes);
// app.use(express.static("uploads"))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get('/flush-cache', async (req, res) => {
//   await redisClient.flushAll();
//   res.json({ message: "Cache cleared!" });
// });
const start = async () => {
    const connectDB = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


}

start();


