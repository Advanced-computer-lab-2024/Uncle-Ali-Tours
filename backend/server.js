import express from 'express';
import { connectDB } from './config/db.js';
import activityRoutes from './routes/activity.route.js';
import activityCategoryRouts from './routes/activityCategory.route.js';
import userRouts from './routes/user.route.js';
import productRoutes from './routes/product.routes.js';
import preferencetagRoute from './routes/preferencetag.route.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use("/api/users", userRouts);
app.use("/api/activityCategory", activityCategoryRouts);
app.use("/api/activity", activityRoutes);
app.use("/api/product",productRoutes);
app.use("/api/preferencetags",preferencetagRoute);
app.listen(PORT, () => {
    connectDB();
    console.log(`server is running on port ${PORT}`);
});