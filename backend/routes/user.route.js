import express from "express";

import { loginUser, createUser, deleteUser, changePassword } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/", createUser);
router.delete("/", deleteUser);
router.put("/changePassword", changePassword);

export default router;