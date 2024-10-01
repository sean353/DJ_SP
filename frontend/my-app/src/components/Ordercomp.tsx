import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrderAsync, selectOrder } from '../slice/orderslice';
import Navbar from '../Navbar';

const Ordercomp: React.FC = () => {
    const orders = useAppSelector(selectOrder); // Get orders from the store
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        dispatch(fetchOrderAsync());
    }, [dispatch]);

    const filteredOrders = orders.filter(order => {
        const Cust_name = order.customer_name
        return String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) || Cust_name.includes(searchTerm);
    });

    return (
        <div className="">
            <Navbar />
            <h1 style={{ textAlign: "center" }}>Search Orders By Customers</h1>
            <input
                style={{ margin: "15px" }}
                type="text"
                className="form-control"
                placeholder="Search Orders By Customers Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <h2 style={{ textAlign: "center" }}>Customer Orders</h2>
            <ul className="responsive-table">
                <li className="table-header">
                    <div className="col col-1">Order ID</div>
                    <div className="col col-2">Customer Name</div>
                    <div className="col col-3">Total Price</div>
                    <div className="col col-4">Order Date</div>
                </li>
                {filteredOrders.map((order) => (
                    <li className="table-row" key={order.id}>
                        <div className="col col-1" data-label="Order ID">{order.id}</div>
                        <div className="col col-2" data-label="Customer Name">{order.customer_name}</div>
                        <div className="col col-3" data-label="Total Price">${order.total_price}</div>
                        <div className="col col-4" data-label="Order Date">
                            {`${new Date(order.created_at).toLocaleDateString('he-IL')} - ${new Date(order.created_at).toLocaleTimeString('he-IL', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}`}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Ordercomp;
