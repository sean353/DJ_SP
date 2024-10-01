import axios from 'axios';
import { Customer } from '../models/Customer';

// הגדר את ה-API שלך (הכתובת היא דוגמה בלבד)
const API_URL = 'http://127.0.0.1:8000/customers/';

// פונקציות API

// פנייה לקבלת פרטי ההזמנה
export const fetchCustomer = async () => {
    const response = await axios.get<Customer[]>(API_URL);
    return response.data;
};

// פונקציה להוספת פריט להזמנה
export const addCustomer = async (customer:Customer) => {
    
      const response = await axios.post(`${API_URL}`, customer);
      console.log(response.data);
      
      return response.data;
}
// פונקציה לעדכון פריט בהזמנה
export const updateCustomer = async (id :string, updatedCustomer: { address: string;phone:string;customer_name:string;}) => {
    const response = await axios.put<Customer>(`${API_URL}${id}/`, updatedCustomer);
    console.log(response.data);
    
    return response.data;
};

// פונקציה להסרת פריט מההזמנה
export const removeCustomer = async (id: string) => {
    const response =await axios.delete(`${API_URL}${id}/`);
    return response.data
};
