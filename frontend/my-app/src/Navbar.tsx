import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { logout, selectAdmin, selectLogged, selectUsername } from './slice/loginslice';
import { selectCartItems, clearcart } from './slice/orderdetilslice';
import { toast,ToastContainer} from 'react-toastify';







const Navbar = () => {
    const dispatch = useAppDispatch()
    const location = useLocation();
    const navigate = useNavigate();
    const uName = useAppSelector(selectUsername)
    const admin = useAppSelector(selectAdmin)
    const logged = useAppSelector(selectLogged)
    const cartItems = useAppSelector(selectCartItems);
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const [refreshflag, setrefreshflag] = useState<boolean>(true)


    useEffect(() => {
        if (logged && !refreshflag) {
            console.log("Navigating to product page after login");
            navigate('/product');
            setrefreshflag(false);
            console.log("waga");

        } else if (!logged && !refreshflag) {
            navigate("/login");
            setrefreshflag(false);
        }
    }, [logged, refreshflag, navigate]);




    const handlelogout = () => {
        if(uName){
            localStorage.removeItem(`cart_${uName}`)
        }
        dispatch(clearcart())
        dispatch(logout())
        toast.info(`${uName } Logged out successfuliy`)
        setTimeout(() => {
            navigate('/');
          }, 1000); // המתנה של שניה לפני המעבר
  

    }
    const isSpecificPage = location.pathname === '/product' && !admin;
    return (
        

        <div><nav className="navbar navbar-inverse" style={{ 
            marginBottom: '0', 
            padding: '0', 
            position: 'fixed',  // שינינו ל-fixed
            top: '0',            // שומר את ה-Navbar בחלק העליון של המסך
            width: '100%',       // ה-Navbar יתפוס את כל רוחב המסך
            zIndex: 1000         // כדי לוודא שה-Navbar יישאר מעל אלמנטים אחרים
        }}>
            
            <div className="container-fluid" style={{ padding: '0' }}>
                <div className="navbar-header">
                    <button
                        type="button"
                        className="navbar-toggle"
                        data-toggle="collapse"
                        data-target="#myNavbar"
                    >
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="/">
        <img src="/logo.png" alt="Logo" style={{ height: '50px',marginTop:"-15px" }} />
      </a>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                        {admin? ( <ul className="nav navbar-nav">
                        
                        <li className="">
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/product">Products</Link>
                        </li>
                        <li>
                            <Link to="/category">Category</Link>
                        </li>
                        <li>
                            <Link to="/order_detils">Order detils</Link>
                        </li>
                        <li>
                            <Link to="/order">Order</Link>
                        </li>
                        <li>
                            <Link to="/customer">Customers</Link>
                        </li>
                    </ul>):( <ul className="nav navbar-nav">
                        
                        <li className="">
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/product">Products</Link>
                        </li>
                        <li>
                            <Link to="/category">Category</Link>
                        </li>
                        <li>
                            <Link to="/my_orders">My Orders</Link>
                        </li>
                    </ul>)}
                   
                    <ul className="nav navbar-nav navbar-right" style={{ marginRight: isSpecificPage ? "230px" : "0px" }}>
                        {logged ? (
                            <>

                                <li className='navbar-text'>Welcome , {uName}</li>
                                <li>
                                    <button onClick={() => handlelogout()} className='btn btn-danger' style={{ marginTop: '8px' }}>Logout</button>


                                </li>

                            </>
                        ) : (<>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <Link to="/register" className='btn btn-primary' style={{marginTop:"8px"}}>Sign Up</Link>
                        </>
                        )}

                        <li>

                            
                        <Link to="/cart">Cart  ${totalPrice.toFixed(2)}</Link>
                            
                        </li>
                        
        
                    </ul>
                </div>
            </div>
        </nav>
        </div>
    )
}

export default Navbar