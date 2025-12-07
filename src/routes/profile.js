const express = require("express")
const router = express.Router()
const { getMyProfile, saveProfile } = require("../controllers/profileController")
const { authMiddleware } = require("../middleware/authMiddleware")

router.get("/me", authMiddleware, getMyProfile)
router.post("/save", authMiddleware, saveProfile)

module.exports = router
