import express from "express";

import { loginUser, createUser, deleteUser, changePassword, getUsersNumber, getNewUsersLastMonth  } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/", createUser);
router.delete("/", deleteUser);
router.put("/changePassword", changePassword);
router.get("/analitic/number", getUsersNumber);
router.get("/analitic/new", getNewUsersLastMonth);
export default router;