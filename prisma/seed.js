require('dotenv').config()
const {PrismaClient}=require('../generated/prisma')
const bcrypt=require('bcryptjs')

const prisma=new PrismaClient()

async function main(){
    console.log('Seeding database...')

    const hashedPassword=await bcrypt.hash('password123',10)

    const users=[
        {name:'Rk_Enzo',email:'enzo@bgmi.com',password:hashedPassword},
        {name:'Shadow_King',email:'shadow@bgmi.com',password:hashedPassword},
        {name:'Pro_Sniper',email:'sniper@bgmi.com',password:hashedPassword},
        {name:'Rush_Master',email:'rush@bgmi.com',password:hashedPassword},
        {name:'Support_God',email:'support@bgmi.com',password:hashedPassword},
        {name:'Clutch_King',email:'clutch@bgmi.com',password:hashedPassword},
        {name:'Ninja_Pro',email:'ninja@bgmi.com',password:hashedPassword},
        {name:'Med_King',email:'medking@bgmi.com',password:hashedPassword},
        {name:'Headshot_99',email:'headshot@bgmi.com',password:hashedPassword},
        {name:'Tactical_Fox',email:'tactical@bgmi.com',password:hashedPassword},
        {name:'Storm_Rider',email:'storm@bgmi.com',password:hashedPassword},
        {name:'Ghost_Player',email:'ghost@bgmi.com',password:hashedPassword}
    ]

    const profiles=[
        {ign:'Rk_Enzo',rank:'Conqueror',role:'Fragger',kd:3.4,level:75,device:'iPhone 14 Pro',sensitivity:'High',about:'Aggressive playstyle, love hot drops and intense fights',phone:'9876543210',discordId:'enzo#1234'},
        {ign:'Shadow_King',rank:'Ace',role:'IGL',kd:2.8,level:68,device:'iPad Pro',sensitivity:'Medium',about:'Strategic leader with good communication and game sense',phone:'9876543211',discordId:'shadow#5678'},
        {ign:'Pro_Sniper',rank:'Crown',role:'Sniper',kd:3.1,level:72,device:'OnePlus 11',sensitivity:'Low',about:'Long range specialist, patient player with high accuracy',phone:'9876543212',discordId:'prosniper#9012'},
        {ign:'Rush_Master',rank:'Ace',role:'Fragger',kd:2.5,level:65,device:'Samsung S23',sensitivity:'Very High',about:'Fast-paced gameplay, quick reflexes and aggressive pushing',phone:'9876543213',discordId:'rush#3456'},
        {ign:'Support_God',rank:'Diamond',role:'Support',kd:2.2,level:60,device:'iPhone 13',sensitivity:'Medium',about:'Team player, great at revives and providing cover fire',phone:'9876543214',discordId:'support#7890'},
        {ign:'Clutch_King',rank:'Conqueror',role:'IGL',kd:3.8,level:80,device:'iPad Mini',sensitivity:'Medium',about:'Calm under pressure, clutch master with 1v4 experience',phone:'9876543215',discordId:'clutch#2468'},
        {ign:'Ninja_Pro',rank:'Ace',role:'Fragger',kd:3.0,level:70,device:'Asus ROG 6',sensitivity:'High',about:'Sneaky gameplay, love to flank and surprise enemies',phone:'9876543216',discordId:'ninja#1357'},
        {ign:'Med_King',rank:'Crown',role:'Support',kd:2.4,level:58,device:'iPhone 12',sensitivity:'Medium',about:'Best support player, always ready with meds and smokes',phone:'9876543217',discordId:'medking#9753'},
        {ign:'Headshot_99',rank:'Conqueror',role:'Sniper',kd:3.6,level:78,device:'RedMagic 8',sensitivity:'Low',about:'High accuracy sniper, confident long-range shots',phone:'9876543218',discordId:'headshot#8642'},
        {ign:'Tactical_Fox',rank:'Ace',role:'IGL',kd:2.9,level:67,device:'iPhone 15 Pro',sensitivity:'Medium',about:'Smart rotations and zone control specialist',phone:'9876543219',discordId:'tactical#7531'},
        {ign:'Storm_Rider',rank:'Crown',role:'Fragger',kd:2.7,level:63,device:'Poco F5',sensitivity:'High',about:'Aggressive entry fragger with good spray control',phone:'9876543220',discordId:'storm#4826'},
        {ign:'Ghost_Player',rank:'Diamond',role:'Sniper',kd:2.3,level:55,device:'Samsung A54',sensitivity:'Low',about:'Stealth player, good positioning and patience',phone:'9876543221',discordId:'ghost#3579'}
    ]

    for(let i=0;i<users.length;i++){
        let user=await prisma.user.upsert({
            where:{email:users[i].email},
            update:{},
            create:users[i]
        })
        console.log(`Created user: ${user.email}`)

        await prisma.profile.upsert({
            where:{userId:user.id},
            update:profiles[i],
            create:{
                userId:user.id,
                ...profiles[i]
            }
        })
        console.log(`Created profile for: ${profiles[i].ign}`)
    }

    console.log('Seeding completed!')
}

main()
    .catch((e)=>{
        console.error(e)
        process.exit(1)
    })
    .finally(async ()=>{
        await prisma.$disconnect()
    })
