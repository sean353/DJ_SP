import axios from 'axios';
import { Order } from '../models/Order';

// הגדר את ה-API שלך (הכתובת היא דוגמה בלבד)
const API_URL = 'http://127.0.0.1:8000/orders/';

// פונקציות API

// פנייה לקבלת פרטי ההזמנה
export const fetchOrders = async () => {
    const response = await axios.get<Order[]>(API_URL);
    return response.data;
};

// פונקציה להוספת פריט להזמנה
export const addOrder = async (order:Order) => {
    
      const response = await axios.post('http://127.0.0.1:8000/orders/', order);
      console.log(response.data);
      
      return response.data;
}
// פונקציה לעדכון פריט בהזמנה
export const updateOrder = async (updatedOrder: { id: string; customer: string; created_at: Date }) => {
    const response = await axios.put<Order>(`${API_URL}/${updatedOrder.id}`, updatedOrder);
    return response.data;
};

// פונקציה להסרת פריט מההזמנה
export const removeOrder = async (id: string) => {
    const response =
        await axios.delete(`${API_URL}${id}/`);
    return response.data
};
