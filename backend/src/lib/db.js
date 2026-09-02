import mongoose from "mongoose";

export async function connectDB(){
    try{
        const mongoUri =process.env.MONGO_URI
        if(!mongoUri){
            throw new Error ("Mongo_uri required")
        }
        const conn = await mongoose.connect(mongoUri)
        console.log("mangodb connected",conn.connection.host)

    }catch(error){
        console.log("mangodb connection error",error.message)
        process.exit(1);
        

    }
}