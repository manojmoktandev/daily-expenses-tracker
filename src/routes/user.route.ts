import express from "express"
const router = express.Router()
import { register,login, profile, adminLogin, getAllUsers,removeUser, updateProfile } from "../controllers/user.controller"
import Authentication from "../middlewares/authentication.middleware"
import { Roles } from "../types/enums"
import { cloudinaryUploader } from "../middlewares/upload.middleware"
import multer from 'multer';
const upload = multer();
const cloudUpload = cloudinaryUploader()

router.post('/register',cloudUpload.single('profile'),register)
router.post('/login',login)
router.post('/admin/login',adminLogin)
router.put('/update/:id',Authentication([Roles.User]),cloudUpload.single('profile'),updateProfile)

router.get('/',Authentication([Roles.Admin]),getAllUsers)
router.delete('/:id',Authentication([Roles.Admin]),removeUser)
router.get('/profile',Authentication([Roles.User]),profile)


export default router;