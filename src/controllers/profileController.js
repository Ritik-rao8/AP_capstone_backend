const { PrismaClient }=require("../../generated/prisma")
const prisma=new PrismaClient()

async function getMyProfile(req,res){
    try{
        const userId=req.user.userId
        let profile=await prisma.profile.findUnique({where:{userId}})
        if(!profile){
            return res.status(404).json({message:"Profile not found"})
        }
        res.json(profile)
    }catch(error){
        console.error("Get profile error:",error)
        res.status(500).json({message:"Server error"})
    }
}

async function saveProfile(req,res){
    try{
        const userId=req.user.userId
        const {ign,rank,role,kd,level,device,sensitivity,about,phone,discordId}=req.body

        let profile=await prisma.profile.findUnique({where:{userId}})
        if(profile){
            profile=await prisma.profile.update({
                where:{userId},
                data:{ign,rank,role,kd:kd?parseFloat(kd):null,level:level?parseInt(level):null,device,sensitivity,about,phone,discordId}
            })
        }else{
            profile=await prisma.profile.create({
                data:{userId,ign,rank,role,kd:kd?parseFloat(kd):null,level:level?parseInt(level):null,device,sensitivity,about,phone,discordId}
            })
        }
        res.json(profile)
    }catch(error){
        console.error("Save profile error:",error)
        res.status(500).json({message:"Server error"})
    }
}

module.exports={getMyProfile,saveProfile}
