import express from "express";

import { loginUser, createUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", loginUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;