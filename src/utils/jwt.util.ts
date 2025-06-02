import jwt from 'jsonwebtoken'
import { config } from '../config/config'
import { Roles } from '../types/enums'
//import { IPayload } from '../types/global.types'
import { IJwtPayload } from '../interfaces/jwt-payload.interface'
import { Console } from 'console';

const jwtSecret =  config.jwt.secret ?? '';
const jwtExpires = config.jwt.accessExpirationMinutes as any
export const generateJwtToken = (payload:IJwtPayload)=>{
    return jwt.sign(payload,jwtSecret,{expiresIn: jwtExpires})
}

export const verifyJwtToken = (token:string):jwt.JwtPayload=>{
    return jwt.verify(token,jwtSecret) as jwt.JwtPayload

}

