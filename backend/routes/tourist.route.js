import express from "express";
import { createTourist, deleteTourist, getTourist, updateTourist , badgeLevel , updateMyPoints ,bookActivity, getMyPromos, unBook, markNotificationAsRead ,bookRealActivity,bookitineraryActivity,unBookRealActivity , unItiniraryBook , addProductWishlist,removeProductWishlist, getWishlistedProducts,getMyUpcomingItineraries, getMyPastItineraries ,getMyUpcomingActivities,getMyPastActivities,removeProductCart,getCartProducts,addProductToCart} from "../controllers/tourist.controller.js";
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
router.put("/addProductWishlist",addProductWishlist);
router.put("/removeProductWishlist",removeProductWishlist);
router.get("/getWishlistedProducts/:userName", getWishlistedProducts);
router.put("/addProductToCart",addProductToCart);
router.put("/removeProductCart",removeProductCart);
router.get("/getCartProducts/:userName", getCartProducts);
router.put("/updatePoints",updateMyPoints);
router.get("/upcomingItineraries",getMyUpcomingItineraries);
router.get("/pastItineraries",getMyPastItineraries);
router.get("/upcomingActivities",getMyUpcomingActivities);
router.get("/pastActivities",getMyPastActivities);
router.put("/notifications",markNotificationAsRead);
export default router;
