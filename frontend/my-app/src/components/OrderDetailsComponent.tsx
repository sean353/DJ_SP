import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrderDetilsAsync, selectCartItems, selectOrder_detils } from '../slice/orderdetilslice';
import Navbar from '../Navbar';
import { ToastContainer } from 'react-toastify';
import { selectProducts } from '../slice/productslice';

const OrderDetilsComponent: React.FC = () => {
  const orderdetils = useAppSelector(selectOrder_detils);
  const products = useAppSelector(selectProducts)
  const cartItems = useAppSelector(selectCartItems)
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  useEffect(() => {
    dispatch(fetchOrderDetilsAsync());
  }, [dispatch]);

  const filteredOrders = orderdetils.filter(order => String(order.order).toLowerCase().includes(searchTerm.toLowerCase()));

  // מפת הזמנות ייחודיות
  const uniqueOrders = new Map();

  return (
    <div >
      <Navbar />
      <h1 style={{ textAlign: "center" }}>Search Orders</h1>
      <input
        style={{ margin: "15px" }}
        type="text"
        className="form-control"
        placeholder="Search Orders By Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th>OrderID (Order Number)</th>
            <th>Customer Name</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((orderdetil) => {
            
            
            // בדוק אם ה-order_id כבר קיים במפה
            if (!uniqueOrders.has(orderdetil.order)) {
              uniqueOrders.set(orderdetil.order, true); // הוסף את ה-order_id למפה
              return (
                <tr key={orderdetil.id}>
                  <td>{orderdetil.order}</td>
                  <td>{orderdetil.customer_name}</td>
                  <td>
                    {/* הצגת כל המוצרים עבור הזמנה זו */}
                    {filteredOrders.filter(order => order.order === orderdetil.order).map(order => (
                      <div key={order.product}>
                        <h5>{order.product_desc}: Quantity: {order.quantity} -  ${order.product_price}</h5>
                      </div>
                    ))}
                  </td>
                  <td>${orderdetil.total_price}</td>


                  <td>{new Date(orderdetil.Date).toLocaleString('he-IL', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}</td>
                </tr>
              );
            }
            return null; // לא להציג שורות כפולות
          })}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default OrderDetilsComponent;
