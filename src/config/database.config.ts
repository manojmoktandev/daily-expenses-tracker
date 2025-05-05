import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const database_uri:string =  process.env.DB_URI || '';
    await mongoose.connect(database_uri,{
     // authSource:'admin',
      dbName:process.env.DB_NAME
      //serverSelectionTimeoutMS: 5000 // Fail fast if no connection
    });
  } catch (err) {
    console.error('Database connection failed. Retrying in 5 seconds...', err);
   // setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};
