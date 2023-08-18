import { createContext, useReducer } from 'react';
export const Store = createContext();

const initialState = {
  //retrives from local storage user information, if available it is stored, if not the variable is left empty
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    //retrives from local storage cart information, if available it is stored, if not the variable is left empty
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

function reducer(state, action) {
  //large reducer handling the Store context, given an action type, specific responses are output
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id //new item is searched for in cart to check for existence
      );
      const cartItems = existItem //if exists, maps over and replaces, if not it simply appends to the cartItems
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); //added to local storage
      return { ...state, cart: { ...state.cart, cartItems } }; //using spread operator, returns state while only changing cartItems as described above
    case 'CART_REMOVE_ITEM': {
      //similar to add item
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } }; //cart is set to empty
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload }; //user information is taken from the payload and returned as new state
    case 'USER_SIGNOUT':
      return {
        //acts as a reset for when a user signs out
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        //saves shipping address retrieving from payload and returning it within state
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload, //alters the payment method within state to store the payload which contains the payment method
        },
      };
    default:
      return state; //if no case, return state as is
  }
}

export function StoreProvider(props) {
  //store provider is defined
  const [state, dispatch] = useReducer(reducer, initialState); //applies the functionality managing the change of state
  const value = { state, dispatch }; //read the state (state) and update the state (dispatch) is stored in value which is accessible with through useContext
  return <Store.Provider value={value}>{props.children}</Store.Provider>; //value contains the state and dispatch, used to wrap app component in index.js
}
