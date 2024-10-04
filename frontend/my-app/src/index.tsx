import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from './app/store'; // import the Redux store
import Logincomp from './components/Logincomp';
import Products from './components/Products';
import Categorycomp from './components/Categorycomp';
import OrderComponent from './components/Cartcomp';

import OrderDetilsComponent from './components/OrderDetailsComponent';
import CustomerComponent from './components/CustomerComponent';
import RegisterComponent from './components/RegisterComponent';
import Cartcomp from './components/Cartcomp';
import Paypal from './components/Paypal';
import Ordercomp from './components/Ordercomp';
import MyOrdersComponent from './components/MyOrdersComponent';
import ProductByCategory from './components/ProductByCategory';
// import OrderDetailsComponent from './components/OrderDetailsComponent';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="login" element={<Logincomp />} />
            <Route path="product" element={<Products />} />
            <Route path="category" element={<Categorycomp />} />
            <Route path="order" element={<Ordercomp />} />
            <Route path="customer" element={<CustomerComponent />} />
            <Route path="register" element={<RegisterComponent />} />
            <Route path="cart" element={<Cartcomp />} />
            <Route path="paypal" element={<Paypal />} />
            <Route path="order_detils" element={<OrderDetilsComponent/>} />
            <Route path="my_orders" element={<MyOrdersComponent/>} />
            <Route path="/products/categories/:categoryId" element={<ProductByCategory />} />
          <Route path="/categories" element={<Categorycomp />} />

            
            

            {/* <Route path="order" element={<OrderDetailsComponent />} /> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
