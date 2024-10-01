import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerAsync, selectRegisterStatus } from '../slice/registerSlice';
import Navbar from '../Navbar';
import { TextField, Button, Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectLogged } from '../slice/loginslice';

const RegisterComponent: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setaddress] = useState<string>('');
  const [phone, setphone] = useState<string>('');

  const dispatch = useAppDispatch();
  
  const RegisterStatus = useAppSelector(selectRegisterStatus);
 
  const logged = useAppSelector(selectLogged)

  const handleRegister = () => {
    const credentials = { username, email, password,address,phone };
    dispatch(registerAsync(credentials));
    // toast.success('Registration Successful!');
  };

  useEffect(() => {
    if(RegisterStatus == "succeeded"){
      setTimeout(() => {
        toast.success('Registration Successful!');
        
      }, 100);
    }else if (RegisterStatus == "failed"){
      setTimeout(() => {
        toast.error('Registration Failed!');
        
      }, 100);
    }
   
  }, [RegisterStatus])



  


  // הצגת טוסט הודעה לאחר הצלחה או כישלון

  return (
    <div className='background'>
      <Navbar />
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center">
            Register
          </Typography>

          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="address"
              label="Address"
              name="address"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="phone_number"
              label="Phone Number"
              name="phone_number"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              sx={{ marginBottom: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleRegister}
             
              sx={{ marginTop: 2 }}
            >
              {RegisterStatus=="loading" ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>


          </Box>
        </Paper>
      </Container>

      <ToastContainer />
    </div>
  );
};

export default RegisterComponent;
