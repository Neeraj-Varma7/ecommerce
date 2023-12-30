import express from "express";
const router = express.Router();
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updatetOrderToPaid,
    updatetOrderToDelivered,
    getOrders,
} from "../controller/orderController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updatetOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updatetOrderToDelivered);

export default router;