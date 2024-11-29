import express from 'express';
import { createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

// Define a route to create a checkout session
router.post('/create-checkout-session', createCheckoutSession);

export default router;