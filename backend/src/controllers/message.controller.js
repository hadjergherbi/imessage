import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import { hasImageKitConfig, uploadChatMedia } from '../lib/imagekit.js'  
export async function getUserForSidebar (req,res){
    try{
        const loggedInUserId = req.user._id
       const filter = await User.find({_id:{$ne : loggedInUserId}}).select("-clerkId")
       res.status(200).json(filter)

       
    }catch(error){
        return res.status(500).json({message:"internal server error "})

    }
}
export async function getConversationForSidebar (req,res){
    try{
        const loggedInUserId =req.user._id
        const conversations = await Message.aggregate([
    //we keep the converstations whic we sent or received 
    {$match: { //the match means we keep the documents that satisfy the condition like where in sql
         $or : [ //condition 1 or condition 2
            {
                sendId:loggedInUserId
            },
            {
                receiverId :loggedInUserId
            }
         ]
    }},
    {
        $groupe:{
            //grouping by the other person 
            _id:{
                 $cond: [
                    {
                        $eq:   ["$sendId",loggedInUserId]
                    },
                    "$receiverId",
                    "$senderId"
                 ]
            },
            lastMessageAt :{
                $max :"$createAt"
            }
        }
    },
    {
        $sort :{
            lastMessageAt:-1

        }
    },
   {
    $lookup :{
        from :"users",
        localField:"_id",
        foreignField:"_id",
        as:"users"
    },


   },
   {$project : {
    clerkId :0
   }
}

        ])
        res.status(200).json(conversations)

    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }
}
export async function getMessages(req,res){
    try{
        const {id: userToChatId}=req.params
        const myId =req.body._id;
        const messages=await Message.find({
            $or:[
                {sendId:myId,receiverId:userToChatId},
                {sendId:userToChatId,receiverId:myId},

            ]
        }
        ).
        sort({cretedAt:1

        })
        res.status(200).json(messages)

    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }

}
export async function sendMessage(req,res){
    try{
        const {text}=req.body
        const {id:receiverId} =req.params
        const senderId=req.user._id //is going to be us

        let imageUrl;
        let videoUrl;
        if(req.file){
            if(!hasImageKitConfig()){
                return res.status(500).json({message:"media upload is not configured"})
            }
           const url =await uploadChatMedia(req.file)
           if (req.file.mimetype.startWith("video/")) videoUrl=url;
           else imageUrl=url
        }
        const newMessage =new Message({
            senderId:senderId,
            receiverId:receiverId,
            text,
            image:imageUrl,
            video:videoUrl
        })
        await newMessage.save()
//real time with socket

       

        res.status(201).json(newMessage)

    }catch(error){
        
        return res.status(500).json({message:"internal server error"})

    }
}