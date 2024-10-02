import express from 'express';
import { connectDB } from './config/db.js';
import userRouts from './routes/user.route.js';
import  activityCategoryRouts from './routes/activityCategory.route.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use("/api/users", userRouts);
app.use("/api/activityCategory", activityCategoryRouts);

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running on port ${PORT}`);
});