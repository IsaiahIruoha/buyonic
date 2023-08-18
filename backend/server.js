import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

dotenv.config(); //allows use of the enviromental variables to be used

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to mongoDB \u{1F40D}');
  })
  .catch((err) => {
    console.log(err.message);
  }); //connects to the mongoose database

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //body parser

app.use('/api/seed', seedRouter); //endpoints created, assosciated with routers
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

const __dirname = path.resolve(); //dirname is a global variable with current working directory
app.use(express.static(path.join(__dirname, '/frontend/build'))); //joins the path and tells http to process static files from a specific directory
app.get(
  '*',
  (req, res) => res.sendFile(path.join(__dirname, '/frontend/build/index.html')) //catch all request, always sends the same file and then javacript handles more routing client side
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message }); //catches all errors server side, comes after all route and use definitions
});

const port = process.env.PORT || 5000; //assign a port for the server to listen to
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
