const express = require("express");
const { PrismaClient } = require("../../generated/prisma");
const router =express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

const prisma = new PrismaClient();
const { signup, login } = require("../controllers/authController");
const { getGoogleAuthURL, oauth2Client } = require("../auth/googleAuth");

router.post("/signup", signup);
router.post("/login", login);

router.get("/google",(req, res) => {
  res.redirect(getGoogleAuthURL());
});

router.get("/google/callback", async(req, res) => {
    try {
        const code = req.query.code;
        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const userInfo = await google.oauth2("v2").userinfo.get({
        auth: oauth2Client,
        });
        const { email, name } = userInfo.data;
        
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
        // Create user with a random password for OAuth users
        const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
        user = await prisma.user.create({
            data: {name, email, password: randomPassword},
        });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "12h",})

        // Redirect to homepage with token, name, and email
        const redirectUrl = `${process.env.FRONTEND_URL}?token=${token}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error("Google OAuth Error:", error);
        res.redirect(`${process.env.FRONTEND_URL}?error=authentication_failed`);
    }
})






module.exports = router;