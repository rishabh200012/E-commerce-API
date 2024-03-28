import {userModel} from './user-model.js';
import jwt from 'jsonwebtoken';
import userRepository from './user-repository.js';
import bcrypt from 'bcrypt';

export default class UserController {
  
  constructor(){
    this.userRepository = new userRepository();
  }

  async resetPassword(req, res, next){
    const {newPassword} = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    const userID = req.userID;
    try{
      await this.userRepository.resetPassword(userID, hashedPassword)
      res.status(200).send("Password is updated");
    }catch(err){
      console.log(err);
      console.log("Passing error to middleware");
      next(err);
    }
  }


 async signUp(req, res) {
    const {name,email,password,type,} = req.body;
    
    const hashPass= await bcrypt.hash(password,12);

    const user = new userModel(name,email,hashPass,type);
    await this.userRepository.signup(user);
    res.status(201).send(user);
  }

  
  async signIn(req, res) {
    try{
   // FIRST WE ARE FINDING USER BY EMAIL (BECAUSE FINDING USER WITH PASSWORD IS NOT A GOOD PRACTICE.....)).
    const user =await this.userRepository.findByEmail(req.body.email);
    // IF USER NOT FOUND THEN RETURN THIS RES.
    if(!user){
      return res
        .status(400)
        .send('Incorrect Credentials');
        // IF FOUND THEN 
    }else{

      // FIRST COMPARE URL (CLIENT'S PASSWORD) WITH THE HASHPASSWORD THAT IS STORED IN DATABASE.. 
       const result= await bcrypt.compare(req.body.password, user.password);
       // IF IT MATCHES THEN 
       if(result){
          // 1. Create token.
      const token = jwt.sign(
        {
          userID: result.id,
          email: result.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      // 2. Send token.
      return res.status(200).send(token);
       }
       // IF NOT FOUND THEN SEND THIS RES.
       else{
        return res
        .status(400)
        .send('Incorrect Credentials');
   
       }
    }


  } catch(err){
    console.log(err);
    return res.status(200).send("something went wrong");
  }
  }
}
