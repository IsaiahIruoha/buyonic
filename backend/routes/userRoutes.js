import express from 'express';
import bcrypt from 'bcryptjs'; //for hashing and verifying passwords
import expressAsyncHandler from 'express-async-handler'; //for error handling in async routes
import User from '../models/userModel.js'; //user Mongoose model
import { isAuth, generateToken } from '../utils.js'; //utilities for authentication and JWT token generation

const userRouter = express.Router();

userRouter.post(
  //route to handle user sign in
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      //if a user is found and the password matches
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user), //generate a JWT token
      });
      return;
    }

    //if email or password do not match, send an error
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  //route to handle user sign up
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      //creating a new user with hashed password
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save(); //saving the user to database

    res.send({
      //send back some user details and a JWT token
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  //route to handle updating user profile
  '/profile',
  isAuth, //middleware to check if user is authenticated
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); //find the user in db

    if (user) {
      user.name = req.body.name || user.name; //update user details. Use provided values or keep the old ones.
      user.email = req.body.email || user.email;
      if (req.body.password) {
        //if a new password is provided, hash it and update
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      //save updated user details to database
      const updatedUser = await user.save();

      //send back some updated user details and a new JWT token
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

export default userRouter;
