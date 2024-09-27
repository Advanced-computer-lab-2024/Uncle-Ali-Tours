import express from "express";

import { getCategories, createCategory, deleteCategory, updateCategory } from "../controllers/activityCategory.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/", deleteCategory);
router.put("/", updateCategory);

export default router;