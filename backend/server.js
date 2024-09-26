import express from 'express';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());



app.listen(PORT, () => {
    connectDB();
    console.log(`server is running on port ${PORT}`);
});