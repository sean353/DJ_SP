import axios from 'axios';



interface UserCredentials {
  username: string;
  password: string;
  email:string;
  address:string;
  phone :string
  
}

export const Register = async (credentials: UserCredentials) => {
  const response = await axios.post('http://127.0.0.1:8000/register/', credentials);
  console.log(credentials);
  
  return response.data;
};