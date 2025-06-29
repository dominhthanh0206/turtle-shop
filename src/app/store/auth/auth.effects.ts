import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(user => {
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            return AuthActions.loginSuccess({ user });
          }),
          catchError(error => 
            of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
      })
    ),
    { dispatch: false }
  );

  checkAuthStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuthStatus),
      switchMap(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            return of(AuthActions.setAuthFromStorage({ user }));
          } catch {
            localStorage.removeItem('user');
            return of(AuthActions.logout());
          }
        }
        return of(AuthActions.logout());
      })
    )
  );
} 