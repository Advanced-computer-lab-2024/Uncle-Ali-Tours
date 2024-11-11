import express from "express";
import {
    createTag, deleteTag,
    getTags,
    updateTag,
} from "../controllers/preference.tags.js";

const router = express.Router();

router.post("/", createTag);
router.get("/", getTags);
router.put("/", updateTag);
router.delete("/", deleteTag);

export default router;