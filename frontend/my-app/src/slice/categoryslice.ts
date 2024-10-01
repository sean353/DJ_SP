import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Category } from '../models/Category';
import { addCategory, deleteCategory, fetchCategory, updateCategory } from '../Api/categoryAPi';
interface CategoriesState {
    categories: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    status: 'idle',
    error: null,
};

// Thunks
export const fetchCategoriesAsync = createAsyncThunk('categories/fetchCategory', async () => {
    const response = await fetchCategory();
    return response;
});

export const addCategoriesAsync = createAsyncThunk('categories/addCategory', async (category: Category) => {
    const response = await addCategory(category);
    return response;
  });
  

  export const updateCategoryAsync = createAsyncThunk(
    'categories/updateCategory',
    async (updateProductData: { id: string; Catdesc: string;}) => {
      const response = await updateCategory(updateProductData.id, updateProductData);
      return response; // ודא שזו התשובה שכוללת את ה-id
    }
  );
export const deleteCategoriesAsync = createAsyncThunk('categories/deleteCategory', async (id: string) => {
    await deleteCategory(id);
    return id;
});

// Slice
const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchCategoriesAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.categories = action.payload;
        })
        .addCase(fetchCategoriesAsync.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch products';
        })
        .addCase(addCategoriesAsync.fulfilled, (state, action) => {
          state.categories.push(action.payload);
        })
        .addCase(updateCategoryAsync.fulfilled, (state, action) => {
          if (action.payload && action.payload.id) {
            state.categories = state.categories.map((product) =>
              product.id === action.payload.id ? action.payload : product
            );
          } else {
            console.error('Update failed: No payload or missing id');
          }
        })
        .addCase(deleteCategoriesAsync.fulfilled, (state, action) => {
          if (action.payload) {
            state.categories = state.categories.filter((category) => category.id !== action.payload);
          }
        });
    },
  });

export default categorySlice.reducer;
export const selectCategory = (state: RootState) => state.categories.categories
export const selectstatus = (state: RootState) => state.categories.status
export const selectError = (state: RootState) => state.categories.error


