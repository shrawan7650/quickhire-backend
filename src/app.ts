import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/user', userRoutes);
app.use('/api/auth',authRoutes)

export default app;
