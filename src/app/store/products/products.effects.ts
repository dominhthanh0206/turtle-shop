import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import * as ProductsActions from './products.actions';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          map(response => ProductsActions.loadProductsSuccess({ response })),
          catchError(error => 
            of(ProductsActions.loadProductsFailure({ 
              error: error.message || 'Failed to load products' 
            }))
          )
        )
      )
    )
  );
} 