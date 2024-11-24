import express from "express";
<<<<<<< Updated upstream
import { createTourist, deleteTourist, getTourist, updateTourist , badgeLevel , updateMyPoints ,bookActivity, getMyPromos, unBook ,bookRealActivity,bookitineraryActivity,unBookRealActivity , unItiniraryBook, addProductWishlist,removeProductWishlist, getWishlistedProducts} from "../controllers/tourist.controller.js";
=======
import { createTourist, deleteTourist, getTourist, updateTourist , badgeLevel , updateMyPoints ,bookActivity, getMyPromos, unBook ,bookRealActivity,bookitineraryActivity,unBookRealActivity , unItiniraryBook , getMyUpcomingItineraries, getMyPastItineraries ,getMyUpcomingActivities,getMyPastActivities} from "../controllers/tourist.controller.js";
>>>>>>> Stashed changes
import { redeemPoints } from '../controllers/tourist.controller.js';  // Import the redeemPoints controller function
import { checkPurchaseStatusByUsername } from "../controllers/tourist.controller.js";
const router = express.Router();

router.post("/",createTourist);
router.get("/", getTourist);
router.put("/",updateTourist);
router.delete("/",deleteTourist);
router.put('/redeemPoints', redeemPoints);
router.get('/check-purchase/:username/:productId', checkPurchaseStatusByUsername);
router.get('/badge', badgeLevel);
router.put("/updateMyBookings",bookActivity);
router.put("/updateRealBookings",bookRealActivity);
router.put("/updateItineraryBookings",bookitineraryActivity);
router.put("/unBook",unBook);
router.put("/unRealActivityBook",unBookRealActivity);
router.put("/unItiniraryBook",unItiniraryBook);
router.post("/promos",getMyPromos);
<<<<<<< Updated upstream
router.put("/addProductWishlist",addProductWishlist);
router.put("/removeProductWishlist",removeProductWishlist);
router.get("/getWishlistedProducts/:userName", getWishlistedProducts);
=======
>>>>>>> Stashed changes
router.put("/updatePoints",updateMyPoints);
router.get("/upcomingItineraries",getMyUpcomingItineraries);
router.get("/pastItineraries",getMyPastItineraries);
router.get("/upcomingActivities",getMyUpcomingActivities);
router.get("/pastActivities",getMyPastActivities);

export default router;