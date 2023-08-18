import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import { useEffect, useReducer } from 'react';

const reducer = (state, action) => {
  //commonly used reducer structure in this program, contains in-progress, success and fail outcomes
  switch (
    action.type //options alter loading key which determines if the loading animation plays
  ) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false }; //if success, the payload is passed into the states update
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreen() {
  //homescreen component defined
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    //reducer call with initial state input
    loading: true,
    products: [],
    error: '',
  });

  useEffect(() => {
    //takes a callback function and an array inwhich a change of any items invokes a function call
    const fetchData = async () => {
      //fetches the product data from the backend
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data }); //if data is received
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message }); //if request fails
      }
    };
    fetchData();
  }, []); //given the empty array, this useEffect will only be triggered once

  return (
    <div>
      <Helmet>
        <title>Buyonic</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {/*applies JSX to every product using different column sizes for responsiveness*/}
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
