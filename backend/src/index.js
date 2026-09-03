import express from 'express';
import "dotenv/config";
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'
import cors from "cors";
import fs from "fs";
import path from "path";
import clerkWebhook from './webhooks/clerk.webhook.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

const app =express();
console.log(process.env.DB_URL);
const PORT =process.env.PORT;
const FRONTED_URL =process.env.FRONTED_URL;
const publicDir=path.join(process.cwd(),"public")
app.use("/api/webhooks/clerk",express.raw({type:"application/json"}),clerkWebhook)
app.use(express.json())
app.use(cors({origin:FRONTED_URL,credentials:true}));
app.use(clerkMiddleware())
app.get("/health",(req,res)=>{
    res.status(200).json({ok:true})
})
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

//this is for production buuild
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}
app.listen(PORT,()=> {
    connectDB();
    console.log("server is running on ",PORT);
      if (process.env.NODE_ENV === "production") job.start();

});
