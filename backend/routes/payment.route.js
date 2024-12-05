import express from 'express';
import { CheckoutUsingWallet, createCheckoutSession, handleSuccessfulPaymentForTourist } from "../controllers/payment.controller.js";

const router = express.Router();

// Define a route to create a checkout session
router.post('/create-checkout-session', createCheckoutSession);
router.put("/handleSuccessfulPayment",handleSuccessfulPaymentForTourist);
router.post("/checkoutUsingWallet",CheckoutUsingWallet);

export default router;