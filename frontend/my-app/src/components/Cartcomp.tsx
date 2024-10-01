import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectCartItems, incrementQuantity, decrementQuantity, clearcart, setCartItems, delprod } from '../slice/orderdetilslice';
import Navbar from '../Navbar';
import { ToastContainer, toast } from 'react-toastify';
import { Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { logout, selectLogged, selectUsername } from '../slice/loginslice';
import { Product } from '../models/Product';
import { useNavigate } from 'react-router-dom';
import { OrderDetails } from '../models/OrderDetails';
import { fetchProductsAsync } from '../slice/productslice';


const Cartcomp: React.FC = () => {
  const cartItems = useAppSelector(selectCartItems);
  const navigate = useNavigate()
  const username = useAppSelector(selectUsername)
  const isLogged = useAppSelector(selectLogged)
  const dispatch = useAppDispatch();
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);



  useEffect(() => {
    dispatch(fetchProductsAsync());
    // dispatch(clearcart()); // אם אתה רוצה לנקות את העגלה כל פעם שמקבלים מוצרים
  }, [dispatch]);


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


  // useEffect(() => {
  //   if (dispatch(logout())) {
  //     setCartItems([])
  //   }

  // }, [cartItems])


  useEffect(() => {
    if (isLogged && username && cartItems.length > 0) {
      localStorage.setItem(`cart_${username}`, JSON.stringify(cartItems));
    } else if (!isLogged || cartItems.length == 0) {
      localStorage.removeItem(`cart_${username}`)

    } else {
      localStorage.removeItem(`cart_${username}`)
    }
  }, [cartItems, isLogged, username]);


  const handlepaypal = () => {
    navigate("/paypal")
    toast.success("navigate paypal");

  }

  const handleIncrement = (id: string) => {
    dispatch(incrementQuantity(id));
    toast.success("Quantity increased");
  };

  const handleDecrement = (id: string) => {
    dispatch(decrementQuantity(id));
    toast.info("Quantity decreased");
  };

  const handleClearCart = () => {
    dispatch(clearcart());
    toast.success("Cart cleared successfully");
  };


  const handleRemoveProduct = (id: string, product: Product) => {
    dispatch(delprod(id));
    toast.error(`${product.description} removed from cart`);
  };

  // const handleremoveprod=(id:string)=>{
  //   dispatch(deleteProductAsync(id))
  // }

  return (
    <div className='background'>
      <Navbar />
      <Typography variant="h4" gutterBottom align="center" color='white'>
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h1" align="center" color='white'>
          Your cart is empty
        </Typography>
      ) : (
        <>
          <Grid container spacing={2} justifyContent="center">
            {cartItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.product.id}>
                <Card sx={{ maxWidth: 345 }}>
                  {item.product.image && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.product.image}
                      alt={item.product.description}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{item.product.description}</Typography>
                    <Typography variant="body1">Price: ${item.product.price}</Typography>
                    <Typography variant="body1">Quantity: {item.quantity}</Typography>
                    <div style={{ marginTop: '10px' }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleIncrement(item.product.id)}
                        style={{ marginRight: '10px' }}
                      >
                        +
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDecrement(item.product.id)}
                      >
                        -
                      </Button>
                      <br />
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveProduct(item.product.id, item.product)}
                        style={{ marginLeft: '30px', marginTop: "10px" }}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1 style={{color:"white"}} >Total Price: ${totalPrice.toFixed(2)}</h1>
            <div style={{ marginTop: '10px' }}>
              <Button variant="contained" color="primary" onClick={() => handlepaypal()}>
                Checkout
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleClearCart}
                style={{ marginLeft: '10px' }}
              >
                Clear Cart
              </Button>

            </div>
          </div>
        </>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Cartcomp;
