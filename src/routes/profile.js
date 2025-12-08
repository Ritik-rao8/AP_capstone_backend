const express = require("express")
const router = express.Router()
const { getMyProfile, saveProfile, getAllProfiles, getProfileById, deleteMyProfile } = require("../controllers/profileController")
const { authMiddleware } = require("../middleware/authMiddleware")

router.get("/all", getAllProfiles)
router.get("/me", authMiddleware, getMyProfile)
router.post("/save", authMiddleware, saveProfile)
router.delete("/me", authMiddleware, deleteMyProfile)
router.get("/:id", getProfileById)

module.exports = router
