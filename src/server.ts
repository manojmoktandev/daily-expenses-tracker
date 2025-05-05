import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from "express"
import helmet from "helmet"
import cors from "cors"
import userRoutes from "./routes/user.route"
import CategoryRoutes from "./routes/category.route"
import ExpenseRoutes from "./routes/expense.route"
import { connectDB } from "./config/database.config"
import ApiError, {errorHandler} from "./middlewares/error-handler.middleware"
import { config } from "./config/config"
import Category from "./models/category.model"
import {status as httpStatus} from "http-status"

const app =  express()
// Update your middleware section to this exact order:
app.use(helmet());
// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

// Body parsers - CRITICAL ORDER
app.use(express.json()); // Handle JSON data
app.use(express.urlencoded({ extended: true })); // Handle form data


// routes
app.get('/',(req:Request,res:Response)=>{
  res.send('Server is up and running')
})
app.use('/api/user',userRoutes)
app.use('/api/category',CategoryRoutes)
app.use('/api/expense',ExpenseRoutes)


app.all('/*spalt',(req:Request,res:Response,next:NextFunction)=>{
    const message =  ` can not ${req.method} on ${req.url}`;
    const error  =  new ApiError(message, httpStatus.NOT_FOUND )
    next(error);
})
const PORT = config.port || 3000;

connectDB()
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
})

app.use(errorHandler)