
import mongoose from "mongoose"
import { Roles } from "./enums"

export type IPayload = {
    _id:mongoose.Types.ObjectId
    email:string,
    username:string,
    fullname:string,
    role:Roles
}