import express from "express";
import { markNotificationAsRead } from '../controllers/notification.controller.js'
const router = express.Router()

router.put("/",markNotificationAsRead);

export default router;