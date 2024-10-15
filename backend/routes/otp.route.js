import express from "express";
const router = express.Router();
import { handleOTP } from "../controllers/opt.controller.js";
router.post("/",handleOTP)

export default router;
