const Product=require('../models/Product');
const Category=require('../models/Category');
const User=require('../models/User');
const Order=require('../models/Order');

const getDashboardStats=async(req,res)=>{
  try{
    const [totalProducts,totalCategories,totalUsers,totalOrders,outOfStock,lowStock]=await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({quantity:0}),
      Product.countDocuments({quantity:{$lte:10,$gt:0}})
    ]);

    return res.status(200).json({
      message:'Dashboard stats fetched',
      stats:{
        totalProducts,
        totalCategories,
        totalUsers,
        totalOrders,
        outOfStock,
        lowStock
      }
    })
  }
  catch(err){
    return res.status(500).json({message:err.message})
  }
}

module.exports={getDashboardStats};