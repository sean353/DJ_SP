import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectCartItems, incrementQuantity, decrementQuantity, delprod, setCartItems, clearcart } from '../slice/orderdetilslice';
import { Button, Card, CardMedia, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Product } from '../models/Product';
import productslice from '../slice/productslice';
import { selectLogged, selectUsername } from '../slice/loginslice';
import { useNavigate } from 'react-router-dom';



const SidebarCart: React.FC = () => {
    const cartItems = useAppSelector(selectCartItems);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLogged = useAppSelector(selectLogged)
    const username = useAppSelector(selectUsername)

    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);



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



    const handlepaypal = ()=>{
        navigate("/paypal")
        
    }
    const handleIncrement = (id: string) => {
        dispatch(incrementQuantity(id));
        toast.success("Quantity increased");
    };

    const handleDecrement = (id: string) => {
        dispatch(decrementQuantity(id));
        toast.info("Quantity decreased");
    };

    const handleRemoveProduct = (id: string, product: Product) => {
        dispatch(delprod(id));
        toast.error(`${product.description} removed from cart`);
    };

    return (
        <div style={sidebarStyles}>
            <Typography variant="h3" align="center" color='black'>
                Cart
            </Typography>

            {cartItems.length === 0 ? (
                <Typography variant="h3" align="center" color='black'>
                    Your cart is empty
                </Typography>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <Card key={item.product.id} style={{ marginBottom: '10px', padding: '10px' }}>
                            {item.product.image && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={item.product.image}
                                    alt={item.product.description}
                                />
                            )}
                            <Typography variant="body1">{item.product.description}</Typography>
                            <Typography variant="body2">Price: ${item.product.price}</Typography>
                            <Typography variant="body2">Quantity: {item.quantity}</Typography>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <Button variant="contained" color="success" onClick={() => handleIncrement(item.product.id)}>
                                    +
                                </Button>
                                <Button variant="contained" color="error" onClick={() => handleDecrement(item.product.id)}>
                                    -
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRemoveProduct(item.product.id, item.product)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </Card>
                    ))}

                    <Typography style={{marginBottom:"0px"}} variant="h4" align="center" color='black'>
                        Total: ${totalPrice.toFixed(2)}
                    </Typography>
                     <Button style={{marginTop:"0px" ,marginLeft:"70px"}} variant="contained" color="success" onClick={()=>handlepaypal()}>
                    
                                    CheckOut
                                </Button>
                </>
            )}
        </div>
    );
};

// עיצוב לסיידבר
const sidebarStyles: React.CSSProperties = {
    position: 'fixed',
    //     bottom: '0px',
    left: '10px',
    //     width: '270px',
    //     backgroundColor: 'white',
    //     padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        maxHeight: '95vh',
        overflowY: 'auto',
};

export default SidebarCart;
