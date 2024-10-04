import React, { useState, useEffect } from 'react';
import { fetchProductsAsync, deleteProductAsync, selectProducts, selectstatus, selectError } from '../slice/productslice';
import Navbar from '../Navbar';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import axios from 'axios';
import { selectAdmin, selectLogged, selectUsername } from '../slice/loginslice';
import { addToCart, clearcart, decrementQuantity, incrementQuantity, selectCartItems, setCartItems } from '../slice/orderdetilslice';
import { ToastContainer, toast } from 'react-toastify';
import { Product } from '../models/Product';
import SidebarCart from './SidebarCart';
import { useLocation } from 'react-router-dom';




const Products: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categories, setcategories] = useState<{ id: string, Catdesc: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null); // שדה חדש עבור קובץ התמונה
  const [searchTerm, setSearchTerm] = useState<string>(""); // שדה חיפוש חדש


  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const location = useLocation();
  const status = useAppSelector(selectstatus);
  const isLogged = useAppSelector(selectLogged)
  const username = useAppSelector(selectUsername)
  const cartItems = useAppSelector(selectCartItems);
  const error = useAppSelector(selectError);
  const admin = useAppSelector(selectAdmin);
  const logged = useAppSelector(selectLogged);
  const cartItem = useAppSelector(selectCartItems)


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
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/categories/');
        setcategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProductsAsync());
    }
  }, [dispatch, status]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImageFile(file);
  };



  const handledelproduct = async (product: Product) => {
    dispatch(deleteProductAsync(product.id))
    setTimeout(() => {
      toast.error(`${product.description} Deleted Succesfully!`)

    }, 100);

  }
  const handleAddProduct = async () => {
    if (description && price && category) {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      try {
        const response = await axios.post('http://127.0.0.1:8000/products/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const addedProduct = response.data;
        setTimeout(() => {
          toast.success(`${addedProduct.description} added successfully!`);
        }, 100);
        dispatch(fetchProductsAsync()); // טען את המוצרים מחדש

      } catch (error) {

      }
    }
  };

  const handleUpdateProduct = async (id: string) => {
    if (description && price && category) {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      try {

        const res = await axios.put(`http://127.0.0.1:8000/products/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const updatedProduct = res.data;
        setTimeout(() => {
          toast.info(`${updatedProduct.description} updatded Successfully!`)
        }, 100);
        dispatch(fetchProductsAsync()); // טען את המוצרים מחדש
      } catch (error) {

      }

    }
  };



  const handleAddToCart = (product: Product) => {
    if (!logged) {
      toast.error(`You Login to add ${product.description} to the cart`)
      return
    }

    dispatch(addToCart(product));
    toast.success(`${product.description} added to cart!`);
  };


  const filteredProducts = products.filter(product =>
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const isSpecificAdmin = location.pathname === '/product' && !admin


  // if (status === 'loading') return <p>Loading...</p>;
  // if (status === 'failed') return <p>Error: {error}</p>;
  return (
    <div className='' style={{ display: isSpecificAdmin?"flex":'',marginLeft:isSpecificAdmin? "250px":'' ,color:"gray"}}>
      {logged && !admin &&(
      <div>
        <SidebarCart></SidebarCart>
      </div>
      )}
      <Navbar />
      {admin && logged ? (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <h1 style={{ marginLeft: "500px", color: "white" }}>Search your Products</h1>
          <input
            type="text"
            className="form-control"
            placeholder="Search Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="col">
            <div className="card">
              <div className="card-body" style={{ marginLeft: "500px" }}>
                <br />
                <h2 style={{ color: "white" }}>Add Product</h2>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">בחר קטגוריה</option>
                  {categories.map((cat: { id: string, Catdesc: string }) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.Catdesc} {/* מציג את שם הקטגוריה */}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <button className="btn btn-primary" onClick={handleAddProduct}>
                  Add Product
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  {filteredProducts.map((product) => (
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
                          <button className="btn btn-danger" onClick={() => handledelproduct(product)}>
                            Delete
                          </button>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleUpdateProduct(product.id)}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4" >
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <h1 style={{ marginLeft: '500px', color: "white", marginTop: "40px" }}>Search your Products</h1>
                  <input
                    style={{ margin: '15px' }}
                    type="text"
                    className="form-control"
                    placeholder="Search Products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {filteredProducts.map((product) => {
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
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" />
    </div>
  );
  
};




export default Products;













// <div className="col-sm-4">
//   <div className="panel panel-danger">
//     <div className="panel-heading">{product.category}</div>
//     <div className="panel-body">
//       <img
//         src="https://placehold.it/150x80?text=IMAGE"
//         className="img-responsive"
//         style={{ width: '100%' }}
//         alt={product.description}
//       />
//     </div>
//     <div className="panel-footer">
//       <p>{product.description}</p>
//       <p>Price: ${product.price}</p>
//       <button className="btn btn-success">Add Product</button>
//     </div>
//   </div>
// </div>