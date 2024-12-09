import express from "express";
import { addDeliveryAddress, addProductToCart, addProductWishlist, badgeLevel, bookActivity, bookRealActivity, bookitineraryActivity, checkPurchaseStatusByUsername, createTourist, deleteTourist, getCartProducts, getMyPastActivities, getMyPastItineraries, getMyPromos, getMyUpcomingActivities, getMyUpcomingItems, getTourist, getWishlistedProducts, handleUnBook, markNotificationAsRead, redeemPoints, removeAllProductsCart, removeProductCart, removeProductWishlist, unBook, unBookRealActivity, unItiniraryBook, updateMyPoints, updateTourist } from "../controllers/tourist.controller.js";

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
router.get("/pastItineraries",getMyPastItineraries);
router.get("/upcomingActivities",getMyUpcomingActivities);
router.get("/pastActivities",getMyPastActivities);
router.put("/notifications",markNotificationAsRead);
router.post("/addDeliveryAddress", addDeliveryAddress);
router.put("/removeAllProductsCart", removeAllProductsCart);
router.put("/handleUnBook", handleUnBook);
router.get("/upcomingItems", getMyUpcomingItems);

router.post("/test", (req, res) => res.send("Test route is working!"));

export default router;
