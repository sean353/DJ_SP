import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrderDetilsAsync, selectOrder_detils } from '../slice/orderdetilslice';
import { selectUsername } from '../slice/loginslice';
import Navbar from '../Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyOrdersComponent: React.FC = () => {
  const orderdetils = useAppSelector(selectOrder_detils);
  const userName = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    dispatch(fetchOrderDetilsAsync());
  }, [dispatch]);

  // סינון ההזמנות לפי שם המשתמש
  const filteredOrders = orderdetils.filter(order => order.customer_name === userName);

  // סינון לפי מונח חיפוש
  const displayedOrders = filteredOrders.filter(order =>
    String(order.order).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // שמירה על מזהים ייחודיים
  const uniqueOrderIds = new Set<string>();
  const uniqueOrders = displayedOrders.filter(order => {
    if (uniqueOrderIds.has(order.order)) {
      return false; // כבר ראינו את ההזמנה הזו
    }
    uniqueOrderIds.add(order.order);
    return true; // זו הזמנה חדשה
  });

  return (
    <div className='background'>
      <Navbar />
      <h1 style={{ textAlign: "center" }}>My Orders</h1>
      <input
  type="text"
  className="form-control form-control-lg"
  placeholder="Search Orders By Number"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    margin: "20px auto", 
    width: "50%", 
    borderRadius: "10px", 
    border: "2px solid #007bff", 
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
  }}
/>
      <div style={{ margin: '20px auto', maxWidth: '100%' }}>
        <ul className="responsive-table mt-4">
          <li className="table-header bg-gray-200 flex text-left font-semibold">
            <div className="col col-1 p-2 w-1/4">Order ID</div>
            <div className="col col-2 p-2 w-1/4">Products</div>
            <div className="col col-3 p-2 w-1/4">Total Price</div>
            <div className="col col-4 p-2 w-1/4">Date</div>
          </li>
          {uniqueOrders.map((orderdetil) => (
            <li key={orderdetil.id} className="table-row flex text-left">
              <div className="col col-1 p-2 w-1/4" data-label="Order ID">{orderdetil.order}</div>
              <div className="col col-2 p-2 w-1/4" data-label="Products">
                {filteredOrders
                  .filter(order => order.order === orderdetil.order)
                  .map(order => (
                    <div key={order.product}>
                      <h5>{order.product_desc}: {order.quantity} - ${order.product_price}</h5>
                    </div>
                  ))}
              </div>
              <div className="col col-3 p-2 w-1/4" data-label="Total Price">${orderdetil.total_price}</div>
              <div className="col col-4 p-2 w-1/4" data-label="Date">
                {new Date(orderdetil.Date).toLocaleString('he-IL', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyOrdersComponent;
