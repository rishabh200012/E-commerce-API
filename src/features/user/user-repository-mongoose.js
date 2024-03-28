import mongoose from "mongoose";
import { userSchema } from "./user-schema.js";
import { ApplicationError} from "../../error-handler.js";

const userModel= mongoose.model("user",userSchema);

export default class userRepository{

    async resetPassword(userID, hashedPassword){
        try{
            let user = await userModel.findById(userID);
            if(user){
                user.password=hashedPassword;
                user.save();
            }else{
                throw new Error("No such user found");
            }
            
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async signup(user){
      try{
       const newUser=new userModel(user);
       await newUser.save();
       return newUser;
      }
      catch(err){
       console.log(err);
       throw new ApplicationError("something went wrong ",500)
      }
    }

    async signin(email,password){
        try{
           return await userModel.findOne({email,password});
           }
           catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong ",500)
           }
    }

    async findByEmail(email) {
        try{ 
        return await userModel.findOne({email});
        } catch(err){
          console.log(err);
          throw new ApplicationError("Something went wrong with database", 500);
        }
      }
}