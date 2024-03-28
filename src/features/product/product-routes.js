import express from 'express';
import ProductController from './product-controller.js';
import { upload } from '../../middleware/file-upload-middleware.js';
import jwtAuth from '../../middleware/jwt-middleware.js';

const productRouter =express.Router();

const productController=new ProductController();



productRouter.get('/filter',(req, res)=>{
productController.filterProducts(req, res)
});

productRouter.post('/rate',jwtAuth,(req, res, next)=>{
        productController.rateProduct(req, res, next)
});

productRouter.post( '/',upload.single('imageUrl'),(req, res)=>{
    productController.addProduct(req, res) 
});
            
productRouter.get('/',(req, res)=>{
productController.getAllProducts(req, res)
});

productRouter.get( '/:id', (req, res)=>{
    productController.getOneProduct(req, res)
 });

 productRouter.get("/averagePrice", (req, res, next)=>{
    productController.averagePrice(req, res)
  });

export default productRouter;

