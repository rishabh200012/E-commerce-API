import "./env.js";
//or
// import dotenv from 'dotenv';
// dotenv.config();
import express, { urlencoded } from 'express';
import swagger from 'swagger-ui-express';
import  productRouter from './src/features/product/product-routes.js';
import userRouter from './src/features/user/user-routes.js';
import jwtAuth from './src/middleware/jwt-middleware.js';
import cartRouter from './src/features/cart/cart-route.js';
import apiDocs from './swagger.json' assert {type: 'json'};
import cors from 'cors';
import loggerMiddleware from './src/middleware/logger-middleware.js';
import {connectToMongodb} from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order-router.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";

const server=express();


var corsOptions={
    origin:"http://localhost:3000"
}

server.use(cors(corsOptions));

//WE CAN DO ALL OF THIS BY JUST USING CORS

// server.use((req, res=>{
//    res.header('Access-Control-Allow-Origin','http://localhost:3000');
//    res.header('Access-Control-Allow-Headers','*');
//    res.header('Access-Control-Allow-Methods','*');
//    if(req.method=="OPTIONS"){
//     return res.sendstatus(200);
//    }
// }));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use("/api-docs", 
swagger.serve, 
swagger.setup(apiDocs));

server.use(loggerMiddleware);

server.use(express.urlencoded({extended:true}));
server.use('api/orders',jwtAuth,orderRouter);
server.use('/api/users',userRouter);
server.use('/api/cartItems',jwtAuth, cartRouter);
server.use("/api/products",jwtAuth, productRouter);
server.get('/',(req, res)=>{
    res.send('Welcome to API');
});

server.listen(3000,()=>{
    console.log('Server is running at 3000');
    // connectToMongodb();
    connectUsingMongoose();
})