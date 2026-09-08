const express = require('express');
const router = express.Router();

const {
  getProducts,getProductById, createProduct,updateProduct,deleteProduct
} = require('../controllers/productController'); 

const authMiddleware =require('../middleware/authMiddleware');
const roleMiddleware=require('../middleware/roleMiddleware');

// PUblic routes
router.get('/', getProducts);  

router.get('/:id', getProductById);    

// admin routes with middleware
router.post('/', authMiddleware, roleMiddleware, createProduct);       // add product

router.put('/:id', authMiddleware, roleMiddleware, updateProduct);     // edit product

router.delete('/:id', authMiddleware, roleMiddleware, deleteProduct);  // remove product

module.exports = router;