import express from 'express';
import {createOrder,updateOrderStatus,getOrdersByUsername,getOrders,getCurrentOrders,getPastOrders,getOrderById,cancelOrder}  from '../controllers/order.controller.js';
const router = express.Router();

router.post('/', createOrder); 
router.get('/', getOrders); 
router.get('/:username', getOrdersByUsername); 
router.get('/:username/current', getCurrentOrders); 
router.get('/:username/past', getPastOrders); 
router.patch('/:id/status', updateOrderStatus);
router.get('/:id/getByID', getOrderById);
router.patch('/:id/cancel', cancelOrder);
export default router;
