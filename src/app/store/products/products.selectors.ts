import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(
  selectProductsState,
  (state: ProductsState) => state.products
);

export const selectFavoriteProducts = createSelector(
  selectProductsState,
  (state: ProductsState) => state.products.filter(product => product.isFavorite)
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state: ProductsState) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state: ProductsState) => state.error
);

export const selectFavoriteIds = createSelector(
  selectProductsState,
  (state: ProductsState) => state.favoriteIds
); 