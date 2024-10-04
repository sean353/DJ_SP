import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, addProduct, updateProduct, deleteProduct, fetchProductsByCategory } from '../Api/productAPi';
import { RootState } from '../app/store';
import { Product } from '../models/Product';

interface ProductsState {
    products: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    status: 'idle',
    error: null,
};


export const fetchProductsByCategoryAsync = createAsyncThunk(
  'products/fetchByCategory',
  async (categoryId:string) => {
      const response = await fetchProductsByCategory(categoryId);
      return response;
  }
);
// Thunks
export const fetchProductsAsync = createAsyncThunk('products/fetchProducts', async () => {
    const response = await fetchProducts();
    return response;
});

export const addProductAsync = createAsyncThunk('products/addProduct', async (product: Product) => {
    const response = await addProduct(product);
    return response;
  });
  

  export const updateProductAsync = createAsyncThunk(
    'products/updateProduct',
    async (updateProductData: { id: string; description: string; price: number; category: string ,image:string}) => {
      const response = await updateProduct(updateProductData.id, updateProductData);
      return response; // ודא שזו התשובה שכוללת את ה-id
    }
  );
export const deleteProductAsync = createAsyncThunk('products/deleteProduct', async (id: string) => {
    await deleteProduct(id);
    return id;
});

// Slice
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProductsAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchProductsByCategoryAsync.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.products = action.payload;
      })
        .addCase(fetchProductsAsync.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.products = action.payload;
        })
        .addCase(fetchProductsAsync.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch products';
        })
        .addCase(addProductAsync.fulfilled, (state, action) => {
          state.products.push(action.payload);
        })
        .addCase(updateProductAsync.fulfilled, (state, action) => {
          if (action.payload && action.payload.id) {
            state.products = state.products.map((product) =>
              product.id === action.payload.id ? action.payload : product
            );
          } else {
            console.error('Update failed: No payload or missing id');
          }
        })
        .addCase(deleteProductAsync.fulfilled, (state, action) => {
          if (action.payload) {
            state.products = state.products.filter((product) => product.id !== action.payload);
          }
        });
    },
  });

export default productSlice.reducer;
export const selectProducts = (state: RootState) => state.products.products
export const selectstatus = (state: RootState) => state.products.status
export const selectError = (state: RootState) => state.products.error


