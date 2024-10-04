import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProductsByCategoryAsync, selectProducts } from '../slice/productslice';
import { incrementQuantity, decrementQuantity, selectCartItems, addToCart, setCartItems, clearcart } from '../slice/orderdetilslice'; // ודא שאתה ייבא את פעולות ה-reducer
import Navbar from '../Navbar';
import { Product } from '../models/Product';
import { fetchCategoriesAsync, selectCategory } from '../slice/categoryslice';
import { selectLogged, selectUsername } from '../slice/loginslice';
import { toast,ToastContainer } from 'react-toastify';

const ProductByCategory = () => {
    const { categoryId } = useParams();
    const dispatch = useAppDispatch();
    const products = useAppSelector(selectProducts);
    const cartItem = useAppSelector(selectCartItems); // הנח שיש לך חלקת cart ב-redux
    const categories = useAppSelector(selectCategory)


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
  
  
    useEffect(() => {
      dispatch(fetchCategoriesAsync());
    }, [dispatch]);
  

    useEffect(() => {
        if (categoryId) {
            dispatch(fetchProductsByCategoryAsync(categoryId)); // שליפת מוצרים לפי קטגוריה
        }
    }, [categoryId, dispatch]);

    const handleAddToCart = (product:Product) => {
      if (!isLogged){
      toast.error("You need to login To add to cart")
        return
      }
        dispatch(addToCart(product)); // ודא שיש לך פעולה של הוספת מוצר לעגלה
    };
    const category = categories.find(cat => cat.id === categoryId);
    
    return (
        <div>
            <Navbar />
            <h2 style={{margin:"60px"}}>Products</h2>
            <div className="row product-list">
                {products.map((product) => {
                    const cartProduct = cartItem.find(item => item.product.id === product.id);
                    return (
                        <div key={product.id} className="col-md-2 mb-4">
                            <div className="panel panel-success">
                                <div className="panel-heading">{product.category_name}</div>
                                <div className="panel-body">
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            className="img-responsive"
                                            style={{ height: '100px', objectFit: 'cover' }}
                                            alt={product.description}
                                        />
                                    )}
                                </div>
                                <div className="panel-footer">
                                    <p>{product.description}</p>
                                    <p>Price: ${product.price}</p>
                                    {cartProduct && cartProduct.quantity > 0 ? (
                                        <div>
                                            <button
                                                onClick={() => dispatch(decrementQuantity(product.id))}
                                                className="btn btn-danger"
                                            >
                                                -
                                            </button>
                                            <span style={{ margin: '0 10px' }}>{cartProduct.quantity}</span>
                                            <button
                                                onClick={() => dispatch(incrementQuantity(product.id))}
                                                className="btn btn-success"
                                            >
                                                +
                                            </button>
                                            <br />
                                            <span>Total Price: ${(cartProduct.quantity * product.price).toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleAddToCart(product)} className="btn btn-success">
                                            Add to cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ToastContainer></ToastContainer>
        </div>
    );
};

export default ProductByCategory;
