const mongoose=require('mongoose');
const dotenv=require('dotenv');

const dns = require('dns');

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore if not supported in environment
}

const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB Connected (Atlas)");
  }
  catch(err){
    console.warn("MongoDB Atlas connection issue: " + err.message + ". Trying local MongoDB fallback...");
    try {
      await mongoose.connect('mongodb://localhost:27017/shopco', { serverSelectionTimeoutMS: 5000 });
      console.log("MongoDB Connected (Local Fallback: mongodb://localhost:27017/shopco)");
    } catch (localErr) {
      console.error("Local MongoDB Error: " + localErr.message);
    }
  }
}

module.exports=connectDB;