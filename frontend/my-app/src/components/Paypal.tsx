import React, { useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearcart, selectCartItems, setCartItems } from '../slice/orderdetilslice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectLogged, selectUserID, selectUsername } from '../slice/loginslice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const Paypal: React.FC = () => {
  const shoppingData = useAppSelector(selectCartItems);
  const user_ID = useAppSelector(selectUserID);
  const totalAmount = shoppingData.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLogged = useAppSelector(selectLogged)
  const username = useAppSelector(selectUsername)
  const cartItems = useAppSelector(selectCartItems) 



  
  useEffect(() => {
    if (isLogged) {
      const savedCart = localStorage.getItem(`cart_${username}`);

      if (savedCart) {
        // טוען את העגלה מה-localStorage אם היא קיימת
        dispatch(setCartItems(JSON.parse(savedCart)));
      } else if (cartItems.length == 0) {
        localStorage.removeItem(`cart_${username}`)
      }
    } else {
      // משתמש לא מחובר, ננקה את העגלה המקומית
      localStorage.removeItem(`cart_${username}`);
      dispatch(clearcart());
    }

    // אם המשתמש יצא מהמערכת או לא מחובר, נבצע נקה את העגלה בזיכרון המקומי

  }, [username, isLogged, dispatch]);



  useEffect(() => {
    if (isLogged && username && cartItems.length > 0) {
      localStorage.setItem(`cart_${username}`, JSON.stringify(cartItems));
    } else if (!isLogged || cartItems.length == 0) {
      localStorage.removeItem(`cart_${username}`)

    } else {
      localStorage.removeItem(`cart_${username}`)
    }
  }, [cartItems, isLogged, username]);

  const paypalOptions = {
    clientId: "AdqKRidLHn0Xwzf2fS9--Hc8erWFpKs127j_pSPBrnMUsys_t-mkxeJc8YPV4HA0yzcf8ZJb49dtTsKS",
    currency: 'USD',
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: totalAmount.toFixed(2),
        },
      }],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    return actions.order.capture().then(async function (details: any) {
      const paypal_ID = details.id;

      // הכנת פרטי ההזמנה (לא כולל product_desc ו-customer_name)
      const orderData = {
        customer: user_ID,
        paypal_ID: paypal_ID,
        total_price: totalAmount.toFixed(2),
        created_at: new Date().toISOString(),
      };

      try {
        // שליחת ההזמנה לשרת
        const response = await axios.post('http://127.0.0.1:8000/orders/', orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const orderId = response.data.id; // קבלת מספר ההזמנה שנוצרה

        // שליחת פרטי ההזמנה (פרטי המוצרים) ל-OrderDetails
        const orderDetailsPromises = shoppingData.map((item) => {
          const orderDetailData = {
            order: orderId, // מספר ההזמנה
            product: item.product.id, // מזהה המוצר
            quantity: item.quantity, // הכמות
          };

          return axios.post('http://127.0.0.1:8000/order-details/', orderDetailData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        });

        // המתנה לכל הבקשות להסתיים
        await Promise.all(orderDetailsPromises);
     
        console.log('Order created successfully:', response.data);

        // ריקון העגלה
        dispatch(clearcart());

        // הצגת הודעת הצלחה
        toast.success('Payment successful!');

        // המתנה לפני המעבר לעמוד הבית
        setTimeout(() => {
          navigate('/product');
        }, 1000); // המתנה של שניה לפני המעבר

      } catch (error) {
        console.error('Error creating order:', error);
        toast.error('Order creation failed!');
      }
    });
  };

  const onError = (err: any) => {
    toast.error('Payment failed!');
    console.error(err);
  };

  return (
    <div className='background' >
      <Navbar></Navbar>
      <h1 style={{ marginTop: "10px", textAlign:"center",color:"white" }}>הגעת לתשלום הסופי</h1>
      <PayPalScriptProvider options={paypalOptions}>
        <div style={{margin:"340px",textAlign:"center"}}>
        <PayPalButtons
          
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError} // כאן השימוש בפונקציה onError
        />
      </div>
      </PayPalScriptProvider>
      <ToastContainer />
      
    </div>
  );
};

export default Paypal;
