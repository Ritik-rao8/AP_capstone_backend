const express = require("express")
const router = express.Router()
const { getMyProfile, saveProfile, getAllProfiles, getProfileById } = require("../controllers/profileController")
const { authMiddleware } = require("../middleware/authMiddleware")

router.get("/all", getAllProfiles)
router.get("/me", authMiddleware, getMyProfile)
router.post("/save", authMiddleware, saveProfile)
router.get("/:id", getProfileById)

module.exports = router
