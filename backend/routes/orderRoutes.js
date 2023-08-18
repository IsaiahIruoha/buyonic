import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router(); //creates a new router
orderRouter.post(
  '/',
  isAuth, //checks the json web token
  expressAsyncHandler(async (req, res) => {
    //expressAsyncHandler deals with errors
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })), //replaces the product field for every orderItem with its _id
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order }); //positive server response sent to user
  })
);

orderRouter.get(
  //used to handle order history
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }); //uses mongoose method on the database to find orders
    res.send(orders); //resonse contains orders
  })
);

orderRouter.get(
  //used to handle the order details page
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id); //given an order id finds the order, extracts from URL
    if (order) {
      res.send(order); //sends the whole order in response
    } else {
      res.status(404).send({ message: 'Order Not Found' }); //order not found
    }
  })
);

export default orderRouter;
