export async function checkAuth(req,res,next) {
//return user field
if(!req.user){
    return res.status(401).json({message:"unauthorized"})
}
res.status(200).json(req.user)
}