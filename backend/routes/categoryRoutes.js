const express = require('express');
const router = express.Router();

const {getCategories,deleteCategory,getCategoryById, updateCategory, createCategory}=require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/',getCategories);

router.get('/:id', getCategoryById)

router.post('/',authMiddleware,roleMiddleware, createCategory)

router.delete('/:id', authMiddleware,roleMiddleware, deleteCategory)

router.put('/:id', authMiddleware,roleMiddleware, updateCategory)



module.exports=router;