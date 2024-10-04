import axios from 'axios';
import { Product } from '../models/Product';


const API_URL = 'http://127.0.0.1:8000/products/'; // Update with your server's URL

export const fetchProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addProduct = async (product: Product) => {
    const response = await axios.post(API_URL,product);
    console.log(response.data);
    
    return response.data;
};

export const updateProduct = async (id: string, updateProductData: { description: string; price: number ,category:string,image:string}) => {
    const response = await axios.put(`http://127.0.0.1:8000/products/${id}/`, updateProductData);
    return response.data;
  };

export const deleteProduct = async (id: string) => {
    const response = await axios.delete(`${API_URL}${id}`+'/');
    return response.data;
};


export const fetchProductsByCategory = async (categoryId: string) => {
    const response = await axios.get(`${API_URL}?category=${categoryId}`);
    return response.data;
};
