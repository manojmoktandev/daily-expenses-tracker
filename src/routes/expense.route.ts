import express from "express"
const router = express.Router()
import { Roles } from "../types/enums";
import Authentication from "../middlewares/authentication.middleware";
import { create, getAllExpenses, getAllUserWise, getById, remove, update } from "../controllers/expense.controller";
import { uploader,cloudinaryUploader } from "../middlewares/upload.middleware"
const cloudUpload = cloudinaryUploader()


router.get('/getall',Authentication([Roles.Admin]),getAllExpenses)
router.get('/getall/user',Authentication([Roles.User]),getAllUserWise)
router.put('/update/:id',Authentication([Roles.User]),cloudUpload.array('receipt',3),update)
router.get('/:id',Authentication([Roles.User]),getById)
router.delete('/:id',Authentication([Roles.User]),remove)
router.post('/create',Authentication([Roles.User]),cloudUpload.array('receipt',3),create)

export default router;