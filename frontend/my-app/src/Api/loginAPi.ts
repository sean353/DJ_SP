import axios from 'axios';



interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await axios.post('http://127.0.0.1:8000/login/', credentials);
  console.log(credentials);
  
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post('http://127.0.0.1:8000/refresh/', { refresh: refreshToken });
  return response.data;
};
