import { getAuth } from "@clerk/express";import User from '../models/user.model.js'
//if it done successfully we call the checkatuh
export async function protectRoute(req,res,next){
try{
   const {userId}=getAuth(req)

   if(!userId){
    return res.status(401).json({message :"unauthorized"})
   }

   const user=await User.findOne({clerkId:userId})
//from the database search filter with clerk id that matches userId
if(!user){
    return res.status(404).json({message:"user profile not synced yet"})
}
req.user =user
next()
}catch(error){
    console.log("errror in protectroute middleware",error.message);
    return res.status(500).json({message:"internal server error"})

}
}
