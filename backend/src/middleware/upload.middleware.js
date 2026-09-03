//one of the most used packets 
//multer has to take the request and pars it
//req.body json 
//for the file we use req.file so we need to set the multer
//browser send the file=>multer is going to decode it =>req.file ready to use 
import multer from "multer";


const MAX_FILE_SIZE =25* 1024*1024;


export const upload = multer ({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:MAX_FILE_SIZE
    },
    //to only allow images and videos and reject everything else 
    fileFilter: (req,file,cb)=>{
        const isImage = file.mimetype.startsWith("image/")
        const isVideo=file.mimetype.startsWith("video/");
        if(!isImage && !isVideo){
            //cb is call back 
            cb(new Error("only image and video uploads are allowd"));
            return;
            //we stop here
        }
        cb(null,true)
        //null there should be no error 


    }
})