import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js'
import userRoutes from './routes/user.routes.js'




dotenv.config();
const app =  express();
app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"))


const start = async () => {
    const connectDB = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


}

start();


