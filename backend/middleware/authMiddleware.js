const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{

  const token=req.headers.authorization;

  if(!token) return res.status(401).json({message:"Error.No Token Provided"})

  try{
    const decoded=jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded;
    next()
  }
  catch(err){
    return res.status(400).json({message:err.message})
  }
}

module.exports=authMiddleware;