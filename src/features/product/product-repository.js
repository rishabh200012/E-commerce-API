import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/application-error.js";
import { productSchema } from "./product-schema.js";
import { reviewSchema } from "./review-schema.js";
import { categorySchema } from "./category-schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const categoryModel=mongoose.model("Category",categorySchema);

class productRepository{
    constructor(){
        this.collection="products";
    }


   
async rate(userID, productID, rating){
    try{
        // 1. Check if product exists
        const productToUpdate = await ProductModel.findById(productID);
        if(!productToUpdate){
            throw new Error("Product not found")
        }

        // Find the existing review
        const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
        if(userReview){
            userReview.rating = rating;
            await userReview.save();
        }else{
            const newReview = new ReviewModel({
                product: new ObjectId(productID),
                user: new ObjectId(userID),
                rating: rating
            });
            newReview.save();
        }

    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);    
    }
}

   async add(productData){
    try{
     const newProduct= new ProductModel(productData);
     const savedProduct=await newProduct.save();

      categoryModel.updateMany(
         {_id:{$in:productData.categories}},
        {$push:{products:new ObjectId(savedProduct._id)}}   
    );
    }
    catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong.",500)
       }
    }

   async get(id){
      try{
        const db=getDb();
        const collection=db.collection(this.collection);
        return await collection.findOne({_id:new ObjectId(id)}); // object id is used here because mongodb expects an object id 
                                                          // and postman send a plane text so to convert it into object id we use this..
      }
      catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong.",500)
      }
    }

   async getAll(){
    try{
        const db = getDb();
        const collection = db.collection(this.collection);
        const products = await collection.find().toArray();
        console.log(products);
        return products;
    } catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
    }
 }

 async filter(minPrice, maxPrice, category){
    try{
        const db = getDb();
        const collection = db.collection(this.collection);
        let filterExpression={};
        if(minPrice){
            filterExpression.price = {$gte: parseFloat(minPrice)}
        }
        if(maxPrice){
            filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
        }
        if(category){
            filterExpression.category=category;
        }
        return await collection.find(filterExpression).toArray();
        
    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
    }
}


async rate(userID, productID, rating){
    try{
        const db =getDb();
        const collection = db.collection(this.collection);
        
        // 1. Removes existing entry
        await collection.updateOne({
            _id:new ObjectId(productID)
        },
        {
            $pull:{ratings:{userID: new ObjectId(userID)}}
        })

        // 2. Add new entry
        await collection.updateOne({
            _id:new ObjectId(productID)
        },{
            $push: {ratings: {userID:new ObjectId(userID), rating}}
        })

    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
    }
}

async averageProductPricePerCategory(){
    try{
        const db=getDb();
        return await db.collection(this.collection)
            .aggregate([
                {
                    // Stage 1: Get Vaerge price per category
                    $group:{
                        _id:"$category",
                        averagePrice:{$avg:"$price"}
                    }
                }
            ]).toArray();
    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);    
    }
}
}

export default productRepository;