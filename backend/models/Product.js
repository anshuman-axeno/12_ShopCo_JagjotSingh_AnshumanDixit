const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
  name:{
    type: String,
    required:true,
  },
  description:{
    type: String,
    required:true,
    trim:true,
  },
  price:{
    type: Number,
    required:true,
    min:0,
  },
  images:[{
    type:String,
  }],
  status:{
    type: String,
    enum:['active','inactive'],
    default:'active'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
},
  quantity:{
    type:Number,
    required:true,
    default:0,
    min:0,
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:true
  }
},
{
  timestamps:true,
}
)

const Product=mongoose.model('Product', productSchema);

module.exports=Product;