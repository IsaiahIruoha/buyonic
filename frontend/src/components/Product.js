import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';

export default function Product(props) {
  const { product } = props; //destructures props for product

  const { state, dispatch: ctxDispatch } = useContext(Store); //destructures for state and ctxDispatch (renamed for clarity) from the shared Store
  const {
    cart: { cartItems }, //pulls cartItems from state, tapping into the shared Store context for fluidity, assigns to cart
  } = state;

  const addToCartHandler = async (item) => {
    //function that manages adding an item to the cart
    const existItem = cartItems.find((x) => x._id === product._id); //checks if item exists in the cart
    const quantity = existItem ? existItem.quantity + 1 : 1; //if it exists, increase the quantity, if not set equal to 1
    const { data } = await axios.get(`/api/products/${item._id}`); //retrieves payload from backend
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock'); //out of stock check
      return;
    }

    ctxDispatch({
      //informs the reducer to perform cart add item action
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    //JSX responsible for displaying the product on the front page
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>{' '}
        {/*conditional logic if the stock is 0 then display an out of stock, disabled button*/}
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}
