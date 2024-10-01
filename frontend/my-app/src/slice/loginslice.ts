import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, refreshToken } from '../Api/loginAPi';
import { RootState } from '../app/store';
import {jwtDecode} from 'jwt-decode'; // תיקן את הייבוא ל- jwtDecode


interface CustomJWTPayload {
  username?: string; // יכול להיות undefined
  admin ?: boolean
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  token: string;
  userName: string | null; // עדכון ל- string | null
  user_id : string | null;
  logged:boolean
  Admin :boolean
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  status: 'idle',
  userName: localStorage.getItem('userName') || null, // עדכון ל-null
  user_id : localStorage.getItem("user_id"),
  token: localStorage.getItem('token') || '', // טוען את הטוקן מ-localStorage אם קיים
  logged: !!localStorage.getItem('token'),
  Admin:  localStorage.getItem('userType') === 'admin' ? true : false 
};


export const loginAsync = createAsyncThunk(
  'login/login',
  async (credentials: { username: string; password: string }) => {
    const response = await login(credentials);
    console.log('Login response:', response); // הוסף לוג
    return response;
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'login/refreshToken',
  async (token: string) => {
    const response = await refreshToken(token);
    return response;
  }
);

const loginslice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userName = null;
      state.token = ''; // לאפס את ה-token ב-state
      state.logged = false; // לאפס את המצב המחובר
      state.status = 'idle'; // החזרת הסטטוס למצב ראשוני
      localStorage.removeItem('token'); // מסיר את הטוקן מ-localStorage בלוגאוט
      localStorage.removeItem('userName'); // מסיר את השם משתמש מ-localStorage בלוגאוט
      localStorage.removeItem('userType');
      
      state.Admin = false
    },
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.token = action.payload.access;
        localStorage.setItem("token",state.token)
        try {
          const decodedToken = jwtDecode<CustomJWTPayload  & { user_id: string }>(state.token);
          console.log('Decoded token:', decodedToken); // הוסף לוג
          state.userName = decodedToken.username || 'unknown'
          
          state.Admin = decodedToken.admin || false
          console.log(decodedToken.admin);
          state.user_id = decodedToken.user_id || ''; // עדכן את ה-user_id מתוך הטוקן
          localStorage.setItem('userName', state.userName);
          localStorage.setItem('user_id', state.user_id);
          localStorage.setItem('userType', state.Admin ? 'admin' : 'user');
          state.logged = true
          
        } catch (error) {
          console.error('Error decoding token:', error);
          state.userName = 'unknown'; // טיפול בשגיאה
          state.user_id = 'unknown';
          state.Admin = false
          state.logged = false;
          
        } state.status = 'succeeded';  
      })
      
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginAsync.rejected, (state) => {
        state.status = 'failed';
      })
      
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.accessToken = action.payload.access;
        state.status = 'succeeded';
      });
  },
});

export const { logout } = loginslice.actions;
export const selectUsername = (state: RootState) => state.login.userName;
export const selectUserID = (state: RootState) => state.login.user_id;
export const selectLogged = (state: RootState) => state.login.logged;
export const selectAdmin = (state: RootState) => state.login.Admin;
export default loginslice.reducer;
