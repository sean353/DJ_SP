import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Order } from '../models/Order';
import { addOrder, fetchOrders, removeOrder, updateOrder } from '../Api/orderApi';
interface OrdersState {
    orders: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    status: 'idle',
    error: null,
};

// Thunks
export const fetchOrderAsync = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await fetchOrders();
    console.log(response);
    
    return response;
});

export const addOrdersAsync = createAsyncThunk('orders/addOrder', async (order: Order) => {
    const response = await addOrder(order);
    return response;
  });
  

  export const updateOrdersAsync = createAsyncThunk(
    'orders/updateOrder',
    async (updatedOrder: { id: string; customer: string; created_at:Date}) => {
      const response = await updateOrder(updatedOrder);
      return response; // ודא שזו התשובה שכוללת את ה-id
    }
  );
export const removeOrdersAsync = createAsyncThunk('orders/removeOrder', async (id: string) => {
    await removeOrder(id);
    return id;
});

// Slice
const OrderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchOrderAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchOrderAsync.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.orders = action.payload;
        })
        .addCase(fetchOrderAsync.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch products';
        })
        .addCase(addOrdersAsync.fulfilled, (state, action) => {
          state.orders.push(action.payload);
        })
        .addCase(updateOrdersAsync.fulfilled, (state, action) => {
          if (action.payload && action.payload.id) {
            state.orders = state.orders.map((order) =>
            order.id === action.payload.id ? action.payload : order
            );
          } else {
            console.error('Update failed: No payload or missing id');
          }
        })
        .addCase(removeOrdersAsync.fulfilled, (state, action) => {
          if (action.payload) {
            state.orders = state.orders.filter((order) => order.id !== action.payload);
          }
        });
    },
  });

export default OrderSlice.reducer;
export const selectOrder = (state: RootState) => state.orders.orders
export const selectstatus = (state: RootState) => state.orders.status
export const selectError = (state: RootState) => state.orders.error


