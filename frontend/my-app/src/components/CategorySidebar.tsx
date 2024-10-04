import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCategoriesAsync, selectCategory } from '../slice/categoryslice';
import { Link } from 'react-router-dom';
import { selectAdmin, selectLogged, selectUsername } from '../slice/loginslice';
import { clearcart, selectCartItems, setCartItems } from '../slice/orderdetilslice';

const CategorySidebar = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategory);
  const isLogged = useAppSelector(selectLogged)
  const username = useAppSelector(selectUsername)
  const cartItems = useAppSelector(selectCartItems)
  const admin = useAppSelector(selectAdmin)


  
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

  return (

      <div className="sidebar" style={{margin:"20px"}}>
        {!admin && (<>
        <h3>Categories</h3>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {/* שימוש ב-Link כדי לנווט לדף של המוצרים לפי קטגוריה */}
            <Link to={`/products/categories/${category.id}`}>
              {category.Catdesc}
            </Link>
          </li>
        ))}
      </ul>
      </>)}
      
    </div>
  );
};

export default CategorySidebar;
