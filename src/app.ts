import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/users', userRoutes);

export default app;
