import express from 'express';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import userRouts from './routes/user.route.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use("/api/users", userRouts);

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running on port ${PORT}`);
});