import express from "express";
const router = express.Router();
import { handleOTP, verifyOTP } from "../controllers/opt.controller.js";

router.post("/",handleOTP)
router.post("/verify",verifyOTP)

export default router;
