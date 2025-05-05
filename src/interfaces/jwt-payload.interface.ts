// interfaces/jwt-payload.interface.ts
import mongoose from 'mongoose';
import { Roles } from '../types/enums';


export interface IJwtPayload {
  _id: mongoose.Types.ObjectId | string;
  email: string;
  fullname: string;
  username: string;
  role: Roles;
  profile: Array<{
    path?: string;
    public_id?: string;
    original_name?: string;
  }>;
}