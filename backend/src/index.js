import express from 'express';
import "dotenv/config";
const app =express();
console.log(process.env.DB_URL);
const PORT =process.env.PORT;
app.listen(PORT,()=> console.log("server is running on ",PORT));
