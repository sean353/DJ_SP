import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../models/Product';
import { RootState } from '../app/store';
import { OrderDetails } from '../models/OrderDetails';
import { fetchOrderDetails } from '../Api/orderdeatilsAPi';

interface CartState {
  orderDetils: OrderDetails[];  // מתקן כאן
  items: { product: Product; quantity: number }[];
}

const initialState: CartState = {
  items: [],
  orderDetils: []
};

export const fetchOrderDetilsAsync = createAsyncThunk('order-detils/fetchOrderDetils', async () => {
  const response = await fetchOrderDetails();
  return response;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.product.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.product.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(item => item.product.id !== action.payload);
      }
    },
    delprod: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    },
    clearcart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<{ product: Product; quantity: number }[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetilsAsync.fulfilled, (state, action: PayloadAction<OrderDetails[]>) => {
        state.orderDetils = action.payload;  // קבלת פרטי ההזמנה
      });
  },
});

export const { addToCart, incrementQuantity, decrementQuantity, clearcart, setCartItems, delprod } = cartSlice.actions;

export default cartSlice.reducer;
export const selectCartItems = (state: RootState) => state.orderDetails.items;
export const selectOrder_detils = (state: RootState) => state.orderDetails.orderDetils;
