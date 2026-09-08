const Category = require('../models/Category');

const getCategories=async(req,res)=>{
  try{
  const categories=await Category.find();
  if(categories.length===0) return res.status(404).json({message:"No categories found"});
  return res.status(200).json({
    message:"Fetched Categories",
    categories
  })
}
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const getCategoryById=async(req,res)=>{
  try{
  let id=req.params.id;
  const category=await Category.findById(id);
  if(!category) return res.status(404).json({message:"No category found"});
  return res.status(200).json({
    message:"Fetched Cateory",
    category
  })
}
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const deleteCategory=async(req,res)=>{
  try{
  let id=req.params.id;
  const deletedCategory=await Category.findByIdAndDelete(id);
  if(!deletedCategory) return res.status(404).json({message:"No category found"});
  return res.status(200).json({
    message:"Deleted Cateory",
    deletedCategory
  })
}
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const updateCategory=async(req,res)=>{
  try{
  let id=req.params.id;
  const {name}=req.body;
  const newCategory={name};
  const updatedCategory=await Category.findByIdAndUpdate(id,newCategory,{new:true, runValidators:true});
  if(!updatedCategory) return res.status(404).json({message:"No category found"});
  return res.status(200).json({
    message:"Updated Cateory",
    updatedCategory
  })
}
  catch(err){
    return res.status(500).json({message:err.message});
  }
}

const createCategory=async(req,res)=>{
  try{
  const {name}=req.body;
  const newCategory={name};
  const createdCategory=await Category.create(newCategory);
  if(!createdCategory) return res.status(404).json({message:"Error.Cannot create category"});
  return res.status(201).json({
    message:"Created Cateory",
    createdCategory
  })
}
  catch(err){
    return res.status(500).json({message:err.message});
  }
}
module.exports={getCategoryById,getCategories,deleteCategory,updateCategory,createCategory};