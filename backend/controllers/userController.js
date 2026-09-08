const User=require('../models/User');

const getProfile=async(req,res)=>{
  try{
    const profile=await User.findById(req.user.id)
    if(!profile) return res.status(404).json({message:"User not found"})
    const {name,email,phone,address}=profile;
    const showProfile={name,email,phone,address};
    return res.status(200).json({
      message:'Profile fetched',
      profile:showProfile
    })
  }
  catch(err){
    return res.status(500).json({ message: err.message });

  }
}

const updateProfile=async(req,res)=>{
  try{
    const {name,phone,address}=req.body;
    const updatedFields={name,phone,address};
    Object.keys(updatedFields).forEach(key=>{
      if(updatedFields[key]===undefined){
        delete updatedFields[key];
      }
    })
    const profile=await User.findByIdAndUpdate(req.user.id,updatedFields,{new:true}).select('-password');
    if(!profile) return res.status(404).json({message:"User not found"})
    return res.status(200).json({
      message:"Profile updated",
      profile
    })  
  }
  catch(err){
    return res.status(500).json({ message: err.message });
  }
}

module.exports={getProfile,updateProfile};