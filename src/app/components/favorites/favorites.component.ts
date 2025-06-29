import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AppState } from '../../store';
import { Product } from '../../store/models/product.model';
import { toggleFavorite } from '../../store/products/products.actions';
import { logout } from '../../store/auth/auth.actions';
import { selectFavoriteProducts } from '../../store/products/products.selectors';
import { selectUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favoriteProducts$: Observable<Product[]>;
  user$: Observable<any>;
  visibleProducts: Product[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private messageService: MessageService
  ) {
    this.favoriteProducts$ = this.store.select(selectFavoriteProducts);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.favoriteProducts$.subscribe(favorites => {
      if (!favorites) return;
      
      if (this.visibleProducts.length === 0) {
        this.visibleProducts = [...favorites];
      } else {
        this.visibleProducts = this.visibleProducts.map(visible => {
          const updated = favorites.find(fav => fav.id === visible.id);
          return updated || visible;
        });
      }
    });
  }

  onToggleFavorite(productId: number): void {
    this.store.dispatch(toggleFavorite({ productId }));
    
    this.visibleProducts = this.visibleProducts.map(product => 
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    );
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  onLogout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }

  getVisibleProducts(): Product[] {
    return this.visibleProducts;
  }
} 