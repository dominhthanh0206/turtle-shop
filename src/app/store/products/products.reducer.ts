import { createReducer, on } from '@ngrx/store';
import { Product } from '../models/product.model';
import * as ProductsActions from './products.actions';

export interface ProductsState {
  products: Product[];
  favoriteIds: Set<number>;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductsState = {
  products: [],
  favoriteIds: new Set(),
  loading: false,
  error: null
};

export const productsReducer = createReducer(
  initialState,
  on(ProductsActions.loadProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductsActions.loadProductsSuccess, (state, { response }) => ({
    ...state,
    products: response.products.map(product => ({
      ...product,
      isFavorite: state.favoriteIds.has(product.id)
    })),
    loading: false,
    error: null
  })),
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ProductsActions.toggleFavorite, (state, { productId }) => {
    const newFavoriteIds = new Set(state.favoriteIds);
    if (newFavoriteIds.has(productId)) {
      newFavoriteIds.delete(productId);
    } else {
      newFavoriteIds.add(productId);
    }
    
    return {
      ...state,
      favoriteIds: newFavoriteIds,
      products: state.products.map(product => 
        product.id === productId 
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    };
  }),
  on(ProductsActions.clearFavorites, state => ({
    ...state,
    favoriteIds: new Set<number>(),
    products: state.products.map(product => ({
      ...product,
      isFavorite: false
    }))
  }))
); 