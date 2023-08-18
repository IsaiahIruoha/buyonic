import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router(); //creating a new router for product-related routes

productRouter.get('/', async (req, res) => {
  //endpoint to get all products
  const products = await Product.find();
  res.send(products);
});

productRouter.get('/slug/:slug', async (req, res) => {
  //endpoint to get a product by its slug (URL-friendly name or identifier)
  const product = await Product.findOne({ slug: req.params.slug }); //searching for a product using its slug
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productRouter.get('/:id', async (req, res) => {
  //endpoint to get a product by its MongoDB _id
  // Searching for a product using its _id
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
