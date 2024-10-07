import express from 'express';

import{ createAdvertiser, getAdvertiser, updateAdvertiser, deleteAdvertiser} from "../controllers/advertiser.controller.js";

const router = express.Router();

router.post('/',createAdvertiser);
router.get('/',getAdvertiser);
router.put('/',updateAdvertiser);
router.delete('/',deleteAdvertiser);





export default router;
