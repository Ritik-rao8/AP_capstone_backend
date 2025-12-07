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

async function getAllProfiles(req,res){
    try{
        const {search,role,rank,kd,sort}=req.query
        let where={}
        
        if(search){
            where.OR=[
                {ign:{contains:search,mode:'insensitive'}},
                {device:{contains:search,mode:'insensitive'}}
            ]
        }
        if(role){
            where.role=role
        }
        if(rank){
            where.rank=rank
        }
        if(kd){
            where.kd={gte:parseFloat(kd)}
        }

        let orderBy={}
        if(sort==='kd'){
            orderBy={kd:'desc'}
        }else if(sort==='level'){
            orderBy={level:'desc'}
        }else{
            orderBy={id:'desc'}
        }

        let profiles=await prisma.profile.findMany({
            where,
            orderBy,
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            }
        })
        res.json(profiles)
    }catch(error){
        console.error("Get all profiles error:",error)
        res.status(500).json({message:"Server error"})
    }
}

async function getProfileById(req,res){
    try{
        const {id}=req.params
        let profile=await prisma.profile.findUnique({
            where:{id:parseInt(id)},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            }
        })
        if(!profile){
            return res.status(404).json({message:"Profile not found"})
        }
        res.json(profile)
    }catch(error){
        console.error("Get profile by ID error:",error)
        res.status(500).json({message:"Server error"})
    }
}

module.exports={getMyProfile,saveProfile,getAllProfiles,getProfileById}
