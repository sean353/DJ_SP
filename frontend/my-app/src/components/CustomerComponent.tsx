import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCustomersAsync, addCustomerAsync, updateCustomerAsync, removeCustomerAsync, selectCustomers, selectCustomerStatus, selectCustomerError } from '../slice/customerslice';
import { Customer } from '../models/Customer';
import Navbar from '../Navbar';
import { toast,ToastContainer} from 'react-toastify';

const CustomerComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const customers = useAppSelector(selectCustomers);
    const status = useAppSelector(selectCustomerStatus);
    const error = useAppSelector(selectCustomerError);

    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredOrders = customers.filter(customer => {
        
        return customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    });
  

    useEffect(() => {
        dispatch(fetchCustomersAsync());
    }, [dispatch]);

    const handleselectcustomer = (id:string)=>{
        setSelectedCustomerId(id)
        const selectedcustomer = customers.find(customer=>customer.id ===id)

        if (selectedcustomer){
            setAddress(selectedcustomer.address)
            setPhone(selectedcustomer.phone)
        }


    }

    const handleUpdateCustomer = (customer:Customer) => {
        const updateData = {
            id: customer.id,
            address: address,
            phone: phone,
            customer_name :customer.customer_name
        };
        if (!address || !phone){
            toast.error("You Need to fill Both Address And Phone!")
        }else{
            
            console.log("Updating customer with data:", updateData); 
            setTimeout(() => {
            toast.info(`${customer.customer_name} Crednatilos Updated Succesfully`)
            },100);
            dispatch(updateCustomerAsync(updateData));
        }
    
        
            
       
    };
    
   

    const handleRemoveCustomer = (id: string) => {
        dispatch(removeCustomerAsync(id));
    };

    // if (status === 'loading') return <p>Loading...</p>;
    // if (status === 'failed') return <p>Error: {error}</p>;

    return (
        <div>
            <Navbar></Navbar>
            <h1 style={{ textAlign: "center" }}>Search Customers</h1>
            <input
                style={{ margin: "15px" }}
                type="text"
                className="form-control"
                placeholder="Search Customers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />




            <h1 style={{marginLeft:"600px"}} className="mt-4">Customers</h1>

            {/* <select
                className="form-control mt-2"
                value={selectedCustomerId || ""}
                onChange={(e) => handleselectcustomer(e.target.value)}
            >
                <option value="" disabled>Select a customer</option>
                {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                        {customer.customer_name}
                    </option>
                ))}
            </select> */}

            <input
                type="text"
                className="form-control mt-1"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <input
                type="text"
                className="form-control mt-2"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            
            <div>
                <div className='table-responsive'>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(customer => (
                                <tr key={customer.id}>
                                    <td>{customer.customer_name}</td>
                                    <td>{customer.address}</td>
                                    <td>{customer.phone}</td>
                                    <td>
                                        <button onClick={()=> handleUpdateCustomer(customer)} className="btn btn-warning btn-sm">Update</button>
                                        <button onClick={() => handleRemoveCustomer(customer.id)} className="btn btn-danger btn-sm ml-2">Delete</button>
                                    </td>
                                </tr>

                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer></ToastContainer>
        </div>

    );
};

export default CustomerComponent;
