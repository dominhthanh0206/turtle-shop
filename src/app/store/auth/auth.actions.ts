import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse } from '../models/user.model';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: LoginResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const checkAuthStatus = createAction('[Auth] Check Auth Status');

export const setAuthFromStorage = createAction(
  '[Auth] Set Auth From Storage',
  props<{ user: LoginResponse }>()
); 