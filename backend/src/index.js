import express from 'express';
import "dotenv/config";
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'
import cors from "cors";

const app =express();
console.log(process.env.DB_URL);
const PORT =process.env.PORT;
const FRONTED_URL =process.env.FRONTED_URL;


app.use(express.json())
app.use(cors({origin:FRONTED_URL,credentials:true}));
app.use(clerkMiddleware())
app.get("/health",(req,res)=>{
    res.status(200).json({ok:true})
})
app.listen(PORT,()=> {
    connectDB();
    console.log("server is running on ",PORT)});
