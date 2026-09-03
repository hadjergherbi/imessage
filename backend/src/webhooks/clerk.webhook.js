import express from 'express';
import User from "../models/user.model.js";
import {verifyWebhook} from "@clerk/backend/webhooks";


const router =express.Router()
router.post("/",async,async (req,res)=>{
    try{
        const signingSecret = process.env.CLERK_WEBHOOK_SIGNIN_SECRET;
    if(!signingSecret){
        res.status(503).json({message:" web hook secret not provided"})
    }
    
    // clerk's verifier expects a Web Request with the raw body; express.raw gives a Buffer.

const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
//sometine the node js doesnot receive the mesage as normal text but it receive it as bytes
//so is buffer function means is the the message is stored as a bugger 
//if it is not stored as text it is converted to a text 

const request = new Request("http://internal/webhooks/clerk", {
  method: "POST",
  headers: new Headers(req.headers),
  body: payload,
});
//request means we are going to create a new http request to /webhooks/clerk
//post is for u/m  sending data 
const evt = await verifyWebhook(request,{signingSecret});
if(evt.type === "user.created" || evt.type === "user.updated" ){
    const u=evt.data;
    const email=
    u.email.addresses?.find((e)=>e.id===u.primary_email_address_id)?.email_address ??
    u.email_addresses?.[0]?.email_address;
    const fullName =
  [u.first_name, u.last_name].filter(Boolean).join(" ") ||
  u.username ||
  u.email?.split("@")[0] ;
  await User.fondOneAndUpdate({clerkId:u.id},
    {clerkId:u.id,email,fullName,profilePic:u.image_url},
    {new:true,upser:true,setDefaultsOnInsert:true},
  )

}
if(evt.type === "user.deleted"){
   if(evt.data.id) await User.findOneAndDelete({
        clerkId:evt.data.id
    })
}
res.status(200).json({received:true})


    }catch(error){
        return res.status(400).json({message:"webhook verfiication failed"})

    }
})


export default router