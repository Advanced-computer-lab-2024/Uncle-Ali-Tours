import express from "express";
import { shareViaMail } from "../controllers/share.conroller.js";

const router = express.Router();
router.post("/email",shareViaMail);

export default router;