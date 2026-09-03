import express from 'express'
import http from "http"
import {Server} from "socket.io"
//socket io allows the frontends and backend to communicate in real time 

const app =express()

const server=http.createServer(app)
//http server because socket.io needs an actual http server to work with 
const allowedOrigin =process.env.FRONTED_URL || "http:..localhost:5173";
 const io = new Server(server,{cors:{origin:[allowedOrigin]}});
 function getReceiverSocketId(userId){
    return userSocketMap[userId]
 }
 //{userid:socketid}
const userSocketMap={};
 //we have both socket server and http 
 io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId
    if(userId) userSocketMap[userId]=socket.id
    //send event to everyone
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        if(userId) delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
    //used to listen to events


 })
 export {app,server,io,getReceiverSocketId}