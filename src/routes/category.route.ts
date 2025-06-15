import express from "express"
const router = express.Router()
import { create,update,getById, remove, getAllUserWise, getAllCategories } from "../controllers/category.controller"
import { Roles } from "../types/enums";
import Authentication from "../middlewares/authentication.middleware";

router.get('/getall',Authentication([Roles.Admin]),getAllCategories)
router.get('/getall/user',Authentication([Roles.User]),getAllUserWise)
router.post('/create',Authentication([Roles.User]),create)
router.put('/update/:id',Authentication([Roles.User]),update)
router.get('/:id',Authentication([Roles.User]),getById)
router.delete('/:id',Authentication([Roles.User]),remove)


export default router;