import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import nodeCrone from 'node-cron';
import { checkBD } from './util/promo.js';

// Route imports
import activityRoutes from './routes/activity.route.js';
import activityCategoryRoutes from './routes/activityCategory.route.js';
import advertiserRoute from './routes/advertiser.route.js';
import attractionRoute from './routes/attraction.route.js';
import attractionsRoute from './routes/attraction.routes.js';
import complaintRoutes from './routes/complaint.route.js';
import flightBookingRoutes from './routes/flightBooking.route.js';
import hotelBookingRoutes from './routes/hotelBooking.route.js';
import itineraryRoutes from './routes/itinerary.route.js';
import optRoutes from './routes/otp.route.js';
import preferencetagRoute from './routes/preferencetag.route.js';
import productRoutes from './routes/product.routes.js';
import requestsRoute from './routes/requests.route.js';
import sellerRoutes from './routes/seller.route.js';
import tourGuide from './routes/tourGuide.route.js';
import touristRoutes from './routes/tourist.route.js';
import userRoutes from './routes/user.route.js';
import promoRoutes from './routes/promo.route.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import shareRoutes from './routes/share.route.js';
import transportaionActivity from './routes/transportationActivity.route.js';

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());



app.use("/api/user", userRoutes);
app.use("/api/activityCategory", activityCategoryRoutes);
app.use("/api/activity", activityRoutes);
app.use('/api/product',productRoutes);
app.use("/api/itinerary",itineraryRoutes);
app.use("/api/tourGuide",tourGuide);
app.use("/api/attraction", attractionRoute);
app.use("/api/seller", sellerRoutes);
app.use("/api/advertiser", advertiserRoute);
app.use("/api/tourist",touristRoutes);
app.use("/api/prefrenceTag",preferencetagRoute);
app.use("/api/attractions", attractionsRoute)
app.use("/api/complaint", complaintRoutes);
app.use("/api/otp", optRoutes);
app.use("/api/hotel-booking", hotelBookingRoutes);
app.use("/api/flight-booking",flightBookingRoutes);
app.use("/api/requests", requestsRoute);
app.use("/api/share",shareRoutes);
app.use("/api/transportaionActivity",transportaionActivity);
app.use("/api/promo", promoRoutes);



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB before setting up routes
connectDB().then(() => {
    console.log('Database connected successfully');

    // Routes
    app.use("/api/user", userRoutes);
    app.use("/api/activityCategory", activityCategoryRoutes);
    app.use("/api/activity", activityRoutes);
    app.use("/api/product", productRoutes);
    app.use("/api/itinerary", itineraryRoutes);
    app.use("/api/attraction", attractionRoute);
    app.use("/api/seller", sellerRoutes);
    app.use("/api/advertiser", advertiserRoute);
    app.use("/api/tourist", touristRoutes);
    app.use("/api/preferenceTag", preferencetagRoute);
    app.use("/api/attractions", attractionsRoute);
    app.use("/api/complaint", complaintRoutes);
    app.use("/api/otp", optRoutes);




    // Start the server after routes are set up
    app.listen(PORT, () => {
        
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database", error);
});



 nodeCrone.schedule('0 0 * * *', async () => {
     await checkBD();
  }
    );