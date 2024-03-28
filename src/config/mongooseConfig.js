import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category-schema.js";

dotenv.config();

const url=process.env.DB_URL;

export const connectUsingMongoose= async()=>{
    try{
     await mongoose.connect(url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
      });
      console.log("Mongoodb is connected using mongoose");
      addCategory();
    }
    catch(err){
      console.log("Error...");
      console.log(err);
    }
}

async function addCategory(){
  const categoryModel=mongoose.model("Category",categorySchema);
  const category=categoryModel.find();
  if(!category || (await category).length==0){
    await categoryModel.insertMany([{title:"Books"},{title:"clothing"},{title:"anadrol"}])
  }
  console.log("Categories added.");
}