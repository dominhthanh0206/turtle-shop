import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// PrimeNG imports
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';

import { AppState } from '../../store';
import { Product } from '../../store/models/product.model';
import { loadProducts, toggleFavorite } from '../../store/products/products.actions';
import { logout } from '../../store/auth/auth.actions';
import { 
  selectAllProducts, 
  selectProductsLoading, 
  selectProductsError,
  selectFavoriteProducts 
} from '../../store/products/products.selectors';
import { selectUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    ToastModule,
    BadgeModule
  ],
  providers: [MessageService],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  favoriteProducts$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  user$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private messageService: MessageService
  ) {
    this.products$ = this.store.select(selectAllProducts);
    this.favoriteProducts$ = this.store.select(selectFavoriteProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loadProducts();
    
    // Handle errors
    if (this.error$) {
      this.error$.subscribe(error => {
        if (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error
          });
        }
      });
    }
  }

  loadProducts(): void {
    this.store.dispatch(loadProducts());
  }

  onToggleFavorite(productId: number): void {
    this.store.dispatch(toggleFavorite({ productId }));
  }

  goToFavorites(): void {
    this.router.navigate(['/favorites']);
  }

  onLogout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }

  getFavoriteCount(): Observable<number> {
    return new Observable(observer => {
      if (this.favoriteProducts$) {
        this.favoriteProducts$.subscribe(favorites => {
          observer.next(favorites ? favorites.length : 0);
        });
      } else {
        observer.next(0);
      }
    });
  }
} 