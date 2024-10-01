import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Customer } from '../models/Customer';
import { fetchCustomer, addCustomer, updateCustomer, removeCustomer } from '../Api/customerApi';

interface CustomerState {
    customers: Customer[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CustomerState = {
    customers: [],
    status: 'idle',
    error: null,
};

// Thunks for async actions
export const fetchCustomersAsync = createAsyncThunk('customers/fetchCustomers', async () => {
    const response = await fetchCustomer();
    return response;
});

export const addCustomerAsync = createAsyncThunk('customers/addCustomer', async (newCustomer: Customer) => {
    const response = await addCustomer(newCustomer);
    return response;
});

export const updateCustomerAsync = createAsyncThunk('customers/updateCustomer', async (updatedCustomer:{id: string; address: string; phone:string; customer_name:string;}) => {
    const response = await updateCustomer(updatedCustomer.id,updatedCustomer);
    console.log(response);
    
    return response;
});

export const removeCustomerAsync = createAsyncThunk('customers/removeCustomer', async (id: string) => {
    await removeCustomer(id);
    return id;
});

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomersAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
            })
            .addCase(fetchCustomersAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addCustomerAsync.fulfilled, (state, action) => {
                state.customers.push(action.payload);
            })
            .addCase(updateCustomerAsync.fulfilled, (state, action) => {
                if (action.payload && action.payload.id) {
                    state.customers = state.customers.map((customer) =>
                    customer.id === action.payload.id ? action.payload : customer
                    );
                  } else {
                    console.error('Update failed: No payload or missing id');
                    console.log(action.payload);
                    
                  }
                })
            .addCase(removeCustomerAsync.fulfilled, (state, action) => {
                state.customers = state.customers.filter(customer => customer.id !== action.payload);
            });
    },
});

export default customerSlice.reducer;
export const selectCustomers = (state: { customers: CustomerState }) => state.customers.customers;
export const selectCustomerStatus = (state: { customers: CustomerState }) => state.customers.status;
export const selectCustomerError = (state: { customers: CustomerState }) => state.customers.error;
