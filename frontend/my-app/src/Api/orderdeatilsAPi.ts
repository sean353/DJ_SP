import axios from 'axios';
import { OrderDetails } from '../models/OrderDetails';

// הגדר את ה-API שלך (הכתובת היא דוגמה בלבד)
const API_URL = 'http://127.0.0.1:8000/order-details/';

// פונקציות API

// פנייה לקבלת פרטי ההזמנה
export const fetchOrderDetails = async () => {
    const response = await axios.get<OrderDetails[]>(API_URL);
    return response.data;
};

// פונקציה להוספת פריט להזמנה
export const addOrderDetail = async (orderDetails: OrderDetails) => {
    console.log('Order Details being sent:', orderDetails);
    const response = await axios.post(`${API_URL}`, orderDetails);
    return response.data;
};

// פונקציה לעדכון פריט בהזמנה
export const updateOrderDetail = async (orderDetail: OrderDetails) => {
    const response = await axios.put<OrderDetails>(`${API_URL}/${orderDetail.id}`, orderDetail);
    return response.data;
};

// פונקציה להסרת פריט מההזמנה
export const removeOrderDetail = async (id: string) => {
    const response =
        await axios.delete(`${API_URL}/${id}`);
    return response.data
};
