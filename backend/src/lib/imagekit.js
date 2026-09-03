import ImageKit,{toFile} from "@imagekit/nodejs";
const imagekit=new ImageKit({privateKey:process.env.IMAGEKIT_PRIVATE_KEY})

function hasImageKitConfig (){
    return Boolean (process.env.IMAGEKIT_PRIVATE_KEY)
}
//my photo (1).png-->change the name to chat-date-safename.png
function createFileName(originalName = "upload") {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `chat-${Date.now()}-${safeName}`;
}
async function uploadChatMedia(file){
    const fileName=createFileName(file.originalname);
    //first we upload to imagekit 
    //file.buffer the actual contents of the image 
    
    const result=await imagekit.files.upload({
        file:await toFile(file.buffer,fileName,{type:file.mimetype}),
        fileName,//give the uploaded file this image
        folder:"/chat" //put it in this folder
    });
    return result.url;

}
export {uploadChatMedia,hasImageKitConfig}