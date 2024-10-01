import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Register } from '../Api/register'

interface CustomerCredentials {
  username: string;
  password: string;
  email: string;
  address:string;
  phone:string
 
}

interface RegisterState {
  isLoading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: RegisterState = {
  isLoading: false,
  status: 'idle',
};

// Async thunk to handle the registration process
export const registerAsync = createAsyncThunk(
  'register/registerAsync',
  async (credentials: CustomerCredentials, { rejectWithValue }) => {
    try {
      const response = await Register(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a slice for the registration process
const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.status = "succeeded";
        
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        
      });
  },
});

export default registerSlice.reducer;
export const selectRegisterLOad = (state: { register: RegisterState }) => state.register.isLoading;
export const selectRegisterStatus = (state: { register: RegisterState }) => state.register.status;

