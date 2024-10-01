import React from 'react';
import './App.css';
import Navbar from './Navbar';
import { Outlet, Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SidebarCart from './components/SidebarCart';



const App: React.FC = () => {
  return (
    <>
      <div className="background">
      <Navbar />
      <ToastContainer />
    
      <h1 style={{color:"white" , textAlign:'center',marginBottom:20}}> Welcome to Supermarket</h1>
        <h1 style={{color:"cadetblue",textAlign:'center'}}>Mission, Vision & Values</h1>

    

      <div>
     





      <Outlet />
      </div>
      </div>

    </>
  );
}

export default App;
