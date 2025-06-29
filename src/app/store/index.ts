import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './auth/auth.reducer';
import { ProductsState, productsReducer } from './products/products.reducer';

export interface AppState {
  auth: AuthState;
  products: ProductsState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  products: productsReducer,
}; 