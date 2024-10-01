import axios from 'axios';
import { Category } from '../models/Category';



const API_URL = 'http://127.0.0.1:8000/categories/'; // Update with your server's URL

export const fetchCategory = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addCategory= async (category: Category) => {
    const response = await axios.post(API_URL,category);
    console.log(response.data);
    
    return response.data;
};

export const updateCategory = async (id: string, updateProductData: { Catdesc: string}) => {
    const response = await axios.put(`${API_URL}${id}/`, updateProductData);
    return response.data;
  };

export const deleteCategory= async (id: string) => {
    const response = await axios.delete(`${API_URL}${id}`+'/');
    return response.data;
};
