import { Document, Types, Model } from 'mongoose';
import { Roles } from '../types/enums';

// Base user properties (pure data structure)
export interface IUserBase {
  email: string;
  fullname: string;
  password: string;
  username: string;
  role: Roles;
  profile: Array<{
    path?: string;
    public_id?: string;
    original_name?: string;
  }>;
  isEmailVerified:boolean;
  createdAt:string;
  updatedAt:string;
}

// Mongoose document extends base interface + adds Mongoose methods
export interface IUserDocument extends IUserBase, Document {
}

// For methods (if needed)
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}


// For statics (if needed)
export interface IUserModel extends Model<IUserDocument, {}, IUserMethods> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
}

// Additional interface for API responses
export interface IUserResponse extends Omit<IUserBase, 'password'> {
  _id: string;
}

export interface UserWithExpense extends IUserBase  {
  expense: {
    total_expense: number;
  };
};

