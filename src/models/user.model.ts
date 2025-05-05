import  {Document, Model, model, Schema, Types} from "mongoose"
import { Roles } from "../types/enums";
import { compare, hash } from "../utils/bcrypt.util";
import { IUserDocument, IUserMethods, IUserModel } from '../interfaces/user.interface';
import { paginate,toJSON } from "./plugins";

const userSchema  =  new Schema<IUserDocument, IUserModel, IUserMethods>({
    email:{
        type:String,
        trim: true,
        lowercase: true,
        required:[true,'Email is required'],
        unique:[true,'Users already exists with provided email'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    fullname:{
        type:String,
        required:[true,'FullName is required']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        trim: true,
        minlength: 8,
        validate(value:string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    username:{
        type:String,
        required:[true,'username is required']
    },
    role:{
        type:String,
        enum:Object.values(Roles),
        required:true,
        default:Roles.User
    },
    profile:{
        type:[  
            {
                path: { type: String },
                public_id: { type: String },
                original_name: { type: String }
            }
        ],
        default:[]
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    }
    
},{timestamps:true})

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Add instance methods
userSchema.methods.comparePassword =  async function(password:string){
    return await compare(this.password,password);
}
  
/// Add static methods
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email:string, excludeUserId?: string) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

// Add middleware
userSchema.pre<IUserDocument>('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await hash(this.password);
    }
    next();
});
    
//  Add virtuals
//   userSchema.virtual('profile.fullName').get(function() {
//     return `${this.name.first} ${this.name.last}`;
//   });

const User =  model<IUserDocument, IUserModel>('user',userSchema)

export default User;