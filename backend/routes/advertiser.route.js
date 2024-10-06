import express from 'express';
import {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity
} from '../controllers/activity.controller.js';

import{
    createAdvertiser,
    getAdvertiser,
    updateAdvertiser,
    deleteAdvertiser
} from '../controllers/advertiser.controller.js';

const router = express.Router();

router.get('/advertiser',createAdvertiser);
router.get('/advertiser',getAdvertiser);
router.get('/advertiser',updateAdvertiser);
router.get('/advertiser',deleteAdvertiser);



router.get('/activities', createActivity);


router.get('/activities', getActivities);


router.put('/activities', updateActivity);


router.delete('/activities', deleteActivity);

export default router;
