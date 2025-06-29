import { createAction, props } from '@ngrx/store';
import { Product, ProductsResponse } from '../models/product.model';

export const loadProducts = createAction('[Products] Load Products');

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ response: ProductsResponse }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const toggleFavorite = createAction(
  '[Products] Toggle Favorite',
  props<{ productId: number }>()
);

export const clearFavorites = createAction('[Products] Clear Favorites'); 