const express=require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getMyOrders, checkout, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/checkoutController');
const router=express.Router();


router.post('/checkout', authMiddleware, checkout);  

router.get('/my-orders', authMiddleware, getMyOrders); 

router.get('/:id', authMiddleware, getOrderById);

router.get('/', authMiddleware, roleMiddleware, getAllOrders);     

router.put('/:id/status', authMiddleware, roleMiddleware, updateOrderStatus);

module.exports=router;