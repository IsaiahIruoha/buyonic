import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './Store';

const root = ReactDOM.createRoot(document.getElementById('root')); //initiated the site, below are several context providers for various actions
root.render(
  <React.StrictMode>
    {/*checks for errors during development*/}
    <StoreProvider>
      {/*provides Store context to all children*/}
      <HelmetProvider>
        {/*allows for easy modification of the title*/}
        <App /> {/*calls the app component which contains the entire website*/}
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
