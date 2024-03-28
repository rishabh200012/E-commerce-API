import {userModel} from '../user/user-model.js';
import bAuth from 'express-basic-auth';

// const basicAuthorizer = (req, res, next)=>{

//     // 1. Check if authorization header is empty.

//     const authHeader = req.headers["authorization"];

//     if(!authHeader){
//         return res.status(401).send("No authorization details found");
//     }
//     console.log(authHeader);
//     // 2. Extract credentials. [Basic qwertyusdfghj345678cvdfgh]
//     const base64Credentials = authHeader.replace('Basic ','');
//     console.log(base64Credentials);
//     // 3. decode crdentials.

//     const decodedCreds = Buffer.from(base64Credentials, 'base64').toString('utf8')
//     console.log(decodedCreds); // [username:password]
//     const creds = decodedCreds.split(':');

//     const user = userModel.getAll().find(u=> u.email==creds[0] && u.password==creds[1]);
//     if(user){
//         next();
//     }
//     else{
//         return res.status(401).send("Incorrect Credentials");
//     }

// }


const basicAuthorizer = (username, password) => {
    // 1. Get users
    const users = UserModel.getAll();
    // 2. Compare email
    const user = users.find((u) =>
      bAuth.safeCompare(username, u.email)
    );
    if (user) {
      // 3. Compare password and return
      return bAuth.safeCompare(
        password,
        user.password
      );
    } else {
      // 4. Return error message
      return false;
    }
  };
  
  const authorizer = bAuth({
    authorizer: basicAuthorizer,
    challenge: true,
  });
  
  export default authorizer;

// export default basicAuthorizer;