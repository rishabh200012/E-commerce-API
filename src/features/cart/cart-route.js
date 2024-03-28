import express from "express";
import  { CartItemsController } from "./cart-controller.js";


const cartRouter=express.Router();

const cartcontroller=new CartItemsController();


cartRouter.delete('/:id', (req, res, next)=>{
    cartcontroller.delete(req, res, next)
 });
cartRouter.post('/', (req, res, next)=>{
    cartcontroller.add(req, res, next)
 });
cartRouter.get('/', (req, res, next)=>{
    cartcontroller.get(req, res, next)
 });

export default cartRouter;