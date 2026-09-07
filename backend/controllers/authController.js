const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');


//signup authentication
const signup= async(req,res)=>{
  try {
    const { name, email, password, phone, address }=req.body;
    
    const existingUser=await User.findOne({email});
    if(existingUser) return res.status(400).json({message:'Email already in use'});  
  
  const hashedPassword=await bcrypt.hash(password,10);

  const user=await User.create({
    name,
    email,
    password:hashedPassword,
    phone,
    address
  });
  const token=jwt.sign({
    id:user._id, role:user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE }
  )

  return res.status(201).json({
    token,
    user:{
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

//login authentication
const login=async(req,res)=>{
  try {
    const {email,password}=req.body;

    const existingUser=await User.findOne({email});
    if(!existingUser){
      return res.status(400).json({
        message:'Invalid Credentials'
      })
    }
    const verifyPassword=await bcrypt.compare(password,existingUser.password);
    if(!verifyPassword){
      return res.status(400).json({
      message:'Invalid Credentials'
      })
    }
    const token=jwt.sign({
      id:existingUser._id, role:existingUser.role
    },
      process.env.JWT_SECRET,
      {expiresIn:process.env.JWT_EXPIRE}
    )
    return res.status(200).json({message:'Logged In',
      token,
      user:{
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      }
    }
    )

  }
  catch(err){
    return res.status(500).json({message:err.message})
  }
}

module.exports={signup,login};