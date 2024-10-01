import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addCategoriesAsync, deleteCategoriesAsync, fetchCategoriesAsync, selectCategory, selectstatus, updateCategoryAsync } from '../slice/categoryslice'
import Navbar from '../Navbar'
import { loginAsync, selectAdmin, selectLogged, selectUsername } from '../slice/loginslice'
import { fetchProductsAsync } from '../slice/productslice'
import { clearcart, selectCartItems, setCartItems } from '../slice/orderdetilslice'
import SidebarCart from './SidebarCart';

const Categorycomp = () => {
    const [Catdesc, setCatdesc] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const dispatch = useAppDispatch()
    const categories = useAppSelector(selectCategory)
    const status = useAppSelector(selectstatus)
    const isLogged = useAppSelector(selectLogged)
    const username = useAppSelector(selectUsername)
    const cartItems = useAppSelector(selectCartItems)
    const admin = useAppSelector(selectAdmin)

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
    

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategoriesAsync());
        }
    }, [dispatch, status]);

    const filteredcategories = categories.filter(category => category.Catdesc.toLowerCase().includes(searchTerm.toLowerCase()))
    return (
        <div className='background'>
            {admin ? (<div>
                <Navbar></Navbar>
                <h1 style={{marginLeft:"500px" ,color:"white"}}>Search your Category</h1>
                <input
                    style={{ margin: "15px" }}
                    type="text"
                    className="form-control"
                    placeholder="Search Categories"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                    style={{ marginLeft: "600px" }}
                    value={Catdesc}
                    onChange={(e) => setCatdesc(e.target.value)}
                    placeholder="Enter category description"
                />
                <button onClick={() => dispatch(addCategoriesAsync({
                    Catdesc,
                    id: ''
                }))} className='btn btn-success'>Add Category</button>
                {categories.length}

                <div>

                    <div className="row">
                        {filteredcategories.map((category) => (
                            <div key={category.id} className="col-sm-2">
                                <div className="panel panel-success">
                                    <div className="panel-heading">{category.Catdesc}</div>

                                    <div className="panel-footer">
                                        {/* <p>{category.Catdesc}</p> */}
                                        <button className="btn btn-danger" onClick={() => dispatch(deleteCategoriesAsync(category.id))}>
                                            Delete
                                        </button>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => dispatch(updateCategoryAsync({ Catdesc: Catdesc, id: category.id }))}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>) : (<div><Navbar></Navbar>
                <div style={{textAlign:"center"}} className="row">
                <h1 style={{marginLeft:"500px", color:"white"} }>Search your Category</h1>
                <input
                    style={{ margin: "15px" }}
                    type="text"
                    className="form-control"
                    placeholder="Search Categories"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                    {filteredcategories.map((category) => (
                        <div key={category.id} className="col-sm-2">
                            <div className="panel panel-success">
                                <div className="panel-heading">{category.Catdesc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            )
            }
            <SidebarCart></SidebarCart>
        </div>
    )
}

export default Categorycomp