const jwt=require('jsonwebtoken');

const roleMiddleware=(req,res,next)=>{
  
  const role=req.user.role;
  if(role!=='admin') { 
    return res.status(403).json({message:"Access Denied.Permission Missing"})
  }
  next()
}

module.exports=roleMiddleware;