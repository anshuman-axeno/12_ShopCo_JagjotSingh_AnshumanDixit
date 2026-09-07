const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  products:[{
    product:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'Product'
    },
    buyPrice:{
      type:Number,
      required:true,
    },
    quantity:{
      type:Number,
      required:true,
      min:1
    },
  }],
  subtotal:{ 
    type: Number, 
    required: true 
  },
  discount:{ 
    type: Number, 
    default: 0 
  },
  total: {
    type: Number, 
    required: true 
  },
  orderStatus:{
    type:String,
    enum:['Order received','Packed','Shipped','Out for Delivery','Delivered'],
    default:'Order received'
  },
  shippingInfo:{
    name:{
      type: String,
      required:true,
    },
    phone:{
      type: Number,
      required:true,
    },
    address:{ 
      type: String, 
      required: true 
    },
  }
},
{
  timestamps:true
}
)

const Order=mongoose.model('Order', orderSchema);

module.exports=Order;