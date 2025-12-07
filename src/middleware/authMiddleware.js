const jwt=require("jsonwebtoken")

function authMiddleware(req,res,next){
    try{
        let authHeader=req.headers.authorization
        if(!authHeader||!authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"Unauthorized"})
        }
        let token=authHeader.split(" ")[1]
        let decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }catch(error){
        console.error("Auth middleware error:",error)
        res.status(401).json({message:"Invalid token"})
    }
}

module.exports={authMiddleware}
