import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loginReducer from '../slice/loginslice';
import productReducer from '../slice/productslice';
import categoryReducer from '../slice/categoryslice';
import orderdetilReducer from '../slice/orderdetilslice';
import orderReducer from '../slice/orderslice';
import customerReducer from '../slice/customerslice';
import registerReducer from '../slice/registerSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    login : loginReducer,
    products : productReducer,
    categories:categoryReducer,
    orderDetails : orderdetilReducer,
    orders : orderReducer,
    customers : customerReducer,
    register : registerReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
