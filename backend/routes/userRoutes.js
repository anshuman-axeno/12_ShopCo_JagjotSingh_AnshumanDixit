const express=require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');
const router=express.Router();


router.get('/profile', authMiddleware, getProfile);

router.put('/profile', authMiddleware, updateProfile);

module.exports=router;