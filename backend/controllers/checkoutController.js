const Order=require('../models/Order')
const Product=require('../models/Product')

const COUPONS = {
  'SAVE10': 0.10,  
  'SAVE20': 0.20,  
};

const getAllOrders=async(req,res)=>{
  try{
    const orders=await Order.find().populate('user','name email').populate('products.product','name price');
    if(orders.length===0) return res.status(404).json({message:'No orders found'})
    return res.status(200).json({
      message:'Orders fetched',
      orders
    }) 
  }
  catch(err){
    return res.status(500).json({message:err.message})
  }
}

const getOrderById=async(req,res)=>{
  try{
    const id=req.params.id;
    const order=await Order.findById(id).populate('user','name email').populate('products.product','name price');
    if(!order) return res.status(404).json({message:'No order found'})
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    return res.status(200).json({
      message:'Order fetched',
      order
    }) 
  }
  catch(err){
    return res.status(500).json({message:err.message})
  }
}

const getMyOrders=async(req,res)=>{
  try{
    const orders=await Order.find({user:req.user.id}).populate('products.product','name price');
    if(orders.length===0) return res.status(404).json({message:'No orders found'})
    return res.status(200).json({
      message:'Orders fetched',
      orders
    }) 
  }
  catch(err){
    return res.status(500).json({message:err.message})
  }
}

const updateOrderStatus=async(req,res)=>{
  try{
    const id=req.params.id;
    const {orderStatus}=req.body;
    const order=await Order.findByIdAndUpdate(id,{orderStatus},{new:true});
    if(!order) return res.status(404).json({message:'No order found'})
    return res.status(200).json({
      message:'Order status updated',
      order
    }) 
  }
  catch(err){
    return res.status(500).json({message:err.message})
  }
}

const checkout=async(req,res)=>{
  try{
    const {items, couponCode, shippingInfo}=req.body;

    if (!items || items.length===0){
      return res.status(400).json({message:'Cart is EMpty'})
    }
    
    let subtotal=0;
    const orderProducts=[];

    for(let i=0;i<items.length;i++){
      const product=await Product.findById(items[i].productId);

      if(!product) return res.status(404).json({message:`Product not found: ${items[i].productId}`});

      if(product.quantity<items[i].quantity){
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.quantity}`
          });
      }
      const itemTotal=product.price*items[i].quantity;
      subtotal+=itemTotal;

      orderProducts.push({
        product:product._id,
        buyPrice:product.price,
        quantity:items[i].quantity
      });
    }

    //calculating discount 
    let discount=0;
    if(couponCode && COUPONS[couponCode]){
      discount=subtotal * COUPONS[couponCode];
    }
    const total=subtotal-discount;

    //create order
    const order=await Order.create({
      user:req.user.id,
      products:orderProducts,
      subtotal,
      discount,
      total,
      shippingInfo
    });

    //reduce product stock
    for(let i=0;i<items.length;i++){
      await Product.findByIdAndUpdate(items[i].productId, {
        $inc: {quantity:-items[i].quantity}
      });
    }
    return res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  }
  catch(err){
    return res.status(500).json({ message: err.message });
  }
}

module.exports={getAllOrders,getMyOrders,getOrderById,checkout,updateOrderStatus}