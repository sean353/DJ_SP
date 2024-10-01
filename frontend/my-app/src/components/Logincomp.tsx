import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginAsync, logout, selectAdmin, selectLogged, selectUsername } from '../slice/loginslice';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const LoginComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const loginStatus = useAppSelector((state) => state.login.status);
  const uName = useAppSelector(selectUsername);
  const logged = useAppSelector(selectLogged);
  const admin = useAppSelector(selectAdmin)
  const navigate = useNavigate()
 
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [refreshflag, setrefreshflag] = useState<boolean>(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginAsync({ username, password }));
    
    
     
   
  };

  const handlelogout=()=>{
    dispatch(logout())
    
    
  }


  
  useEffect(() => {
    if (loginStatus === 'succeeded') {
      setTimeout(() => {
        toast.success("Login successful!")
      }, 100);
      
      // השהייה של 2 שניות לפני הניווט
    } else if (loginStatus === 'failed') {
      toast.error('Login failed: Incorrect credentials');
    }
  }, [loginStatus, navigate]);

  

  useEffect(() => {
    if (logged&&!refreshflag){
      toast.success('Login successful!')
      navigate('/product')
      setrefreshflag(false)
    }else{ 
      setrefreshflag(false)
    } 

    
   
  }, [logged,refreshflag])
  

  return (
    <div className="background">
          <Container component="main" maxWidth="xs"> 
    <Paper elevation={3} style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h1">Login</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '16px' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Login
          </Button>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            color="secondary"
            style={{ marginTop: '8px' }}
            onClick={() => handlelogout()}
          >
            Logout
          </Button>
          {loginStatus === 'loading' && <Typography variant="body2">Loading...</Typography>}
          
          {loginStatus === 'failed' && <Typography variant="body2" color="error">Login failed. Please try again.</Typography>}
        </form>
        
      </Paper>
      <ToastContainer></ToastContainer>
    </Container>
    </div>
  );
};

export default LoginComponent;
