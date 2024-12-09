import express from "express";
<<<<<<< Updated upstream
import { createTourist, deleteTourist, getTourist, updateTourist , badgeLevel , updateMyPoints ,bookActivity, getMyPromos, unBook ,bookRealActivity,bookitineraryActivity,unBookRealActivity , unItiniraryBook, addProductWishlist,removeProductWishlist, getWishlistedProducts} from "../controllers/tourist.controller.js";
import { redeemPoints } from '../controllers/tourist.controller.js';  // Import the redeemPoints controller function
import { checkPurchaseStatusByUsername } from "../controllers/tourist.controller.js";
=======
import { addDeliveryAddress, addProductToCart,addProductWishlist, getActProducts,removeActWishlist,addActWishlist, badgeLevel, bookActivity, bookRealActivity, bookitineraryActivity, checkPurchaseStatusByUsername, checkUpcomingItineraryNotifications, createTourist, deleteTourist, getCartProducts, getMyPastActivities, getMyPastItineraries, getMyPromos, getMyUpcomingItineraries, getMyUpcomingActivities, getMyUpcomingItems, getTourist, getWishlistedProducts, handleSuccessfulPaymentForTourist, handleUnBook, hasPurchasedProduct, markNotificationAsRead, redeemPoints, removeAllProductsCart, removeProductCart, removeProductWishlist, unBook, unBookRealActivity, unItiniraryBook, updateMyPoints, updateTourist } from "../controllers/tourist.controller.js";

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

router.put("/addActWishlist",addActWishlist);
router.put("/removeActWishlist",removeActWishlist);
router.get("/getActProducts/:userName", getActProducts);


router.put("/addProductToCart",addProductToCart);
router.put("/removeProductCart",removeProductCart);
router.get("/getCartProducts/:userName", getCartProducts);
>>>>>>> Stashed changes
router.put("/updatePoints",updateMyPoints);
export default router;