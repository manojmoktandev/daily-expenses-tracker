import * as dotenv from 'dotenv'
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVars = process.env;

export const  config =  {
    env: envVars.APP_ENV,
    port: envVars.PORT,
    hostname:'localhost',
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.APP_ENV === 'test' ? '-test' : ''),
        options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    cloudinary:{
        name : envVars.CLOUDINARY_NAME,
        api_key:envVars.CLOUDINARY_API_KEY,
        api_secret:envVars.CLOUDINARY_API_SECRET
    },
    

};

