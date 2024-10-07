import express from 'express';
import { connectDB } from './config/db.js';
import activityRoutes from './routes/activity.route.js';
import activityCategoryRouts from './routes/activityCategory.route.js';
import attractionRoute from './routes/attraction.route.js';
import itineraryRoutes from './routes/itinerary.route.js';
import preferencetagRoute from './routes/preferencetag.route.js';
import productRoutes from './routes/product.routes.js';
import sellerRoutes from './routes/seller.route.js';
import tourGuide from './routes/tourGuide.route.js';
import touristRoutes from './routes/tourist.route.js';
import userRouts from './routes/user.route.js';
const app = express();
const PORT = process.env.PORT || 5000;
import cors from "cors";

app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  };
  
  app.use(cors(corsOptions));

app.use("/api/user", userRouts);
app.use("/api/activityCategory", activityCategoryRouts);
app.use("/api/activity", activityRoutes);
app.use('/api/product',productRoutes);
app.use("/api/itinerary",itineraryRoutes);
app.use("/api/tourGuide",tourGuide);
app.use("/api/attraction", attractionRoute);
app.use("/api/seller", sellerRoutes);
app.use("/api/tourist",touristRoutes);
app.use("/api/prefrenceTag",preferencetagRoute);
app.listen(PORT, () => {
    connectDB();
    console.log(`server is running on port ${PORT}`);
});