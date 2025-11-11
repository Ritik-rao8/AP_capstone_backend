const express = require("express");
const { PrismaClient } = require("../../generated/prisma");
const router =express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const prisma = new PrismaClient();
//signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const userExist=await prisma.user.findUnique({where:{email}});

        if (userExist){
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser=await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
            }
        });
        
        const token = jwt.sign({userId: newUser.id}, process.env.JWT_SECRET, {expiresIn: '5h'});

        res.status(201).json({ message: "Signup successful",token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });  

    } catch (error) {
        console.error("Signup Error:", error.message);
        console.error("Full Error:", error);
        res.status(500).json({ message: "Server error during signup", error: error.message });
    }
})

//login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try{
        const user=await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });

        }

        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '5h'});

        res.json({ message: "Login successful",token,
            user: { id: user.id, name: user.name, email: user.email }
        })
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }

})

module.exports = router;