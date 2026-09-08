const Product=require('../models/Product');

const getProductById=async (req,res)=>{
  try{
    const id=req.params.id;
    const product=await Product.findById(id).populate('category');
    if(!product) return res.status(404).json({message:"Product not found"});
    return res.status(200).json({
      product
    })
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const createProduct=async (req,res)=>{
  try{
    const {name,price,quantity,description,status,category,images}=req.body;
    const product={
      name,
      price,
      quantity,
      description,
      status,
      category,
      images
    }
    const newProduct=await Product.create(product);
    return res.status(201).json({
      message:"Product added",
      newProduct
    })
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const updateProduct=async (req,res)=>{
  try{
    const id=req.params.id;
    const {name,price,quantity,description,status,category,images}=req.body;
    const updatedProduct={name,price,quantity,description,status,category,images};
    Object.keys(updatedProduct).forEach(key=>{
      if(updatedProduct[key]===undefined){
        delete updatedProduct[key];
      }
    })
    const product=await Product.findByIdAndUpdate(id, { $set: updatedProduct }, { new: true });
    if(!product) return res.status(404).json({message:"Product not found"});
    return res.status(200).json({
      message:"Product updated",
      product
    })
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const deleteProduct=async (req,res)=>{
  try{
    const id=req.params.id;
    const product=await Product.findByIdAndDelete(id);
    if(!product) return res.status(404).json({message:"Product not found"});
    return res.status(200).json({
      message:"Product deleted",
      product
    })
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const getProducts=async (req,res)=>{
  try{
    const filter={};

    //search by name
    if(req.query.search){
      filter.name={$regex: req.query.search, $options:'i'};
    }

    //search by category
    if(req.query.category){
      filter.category=req.query.category;
    }

    //filter by price 
    if(req.query.minimumPrice || req.query.maximumPrice){
      filter.price={};
      if(req.query.minimumPrice) filter.price.$gte=Number(req.query.minimumPrice);
      if(req.query.maximumPrice) filter.price.$lte=Number(req.query.maximumPrice);
    }

    //filter by stock
    if(req.query.availability === 'inStock'){
      filter.quantity={$gt:0};
    }
    else if(req.query.availability === 'outOfStock'){
      filter.quantity=0;
    }

    //product diplsay order/sort
    let sortOption={};
    switch (req.query.sort){
      case 'priceAscending':sortOption={price:1}; break;
      case 'priceDescending': sortOption={price:-1}; break;
      case 'newest': sortOption={createdAt:-1};break;
      case 'name': sortOption={name:1};break;
      default:sortOption={createdAt:-1};
    }

    //pagination
    const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 12;
    const skip=(page-1)*limit;

    //logic
    const products=await Product.find(filter).sort(sortOption).skip(skip).limit(limit).populate('category');

    //pagination values
    const totalProducts=await Product.countDocuments(filter);
    const totalPages=Math.ceil(totalProducts/limit);

    return res.status(200).json({
      products,
      currentPage:page,
      totalPages,
      totalProducts,
    });
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

module.exports={getProductById,createProduct,updateProduct,deleteProduct,getProducts}