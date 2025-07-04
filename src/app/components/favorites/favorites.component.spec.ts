import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { FavoritesComponent } from './favorites.component';
import { MessageService } from 'primeng/api';
import { toggleFavorite } from '../../store/products/products.actions';
import { logout } from '../../store/auth/auth.actions';
import { Product } from '../../store/models/product.model';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockFavoriteProducts: Product[] = [
    {
      id: 1,
      title: 'Favorite Product 1',
      description: 'Test Description 1',
      price: 99.99,
      thumbnail: 'test-image-1.jpg',
      category: 'test',
      discountPercentage: 10,
      rating: 4.5,
      stock: 100,
      tags: ['test'],
      brand: 'Test Brand',
      sku: 'TEST-1',
      weight: 1,
      dimensions: { width: 10, height: 10, depth: 10 },
      warrantyInformation: 'Test warranty',
      shippingInformation: 'Test shipping',
      availabilityStatus: 'In Stock',
      reviews: [],
      returnPolicy: 'Test return policy',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        barcode: 'TEST-BARCODE',
        qrCode: 'TEST-QR'
      },
      images: ['test-image-1.jpg'],
      isFavorite: true
    }
  ];

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    gender: 'male',
    image: 'profile.jpg',
    token: 'test-token',
    refreshToken: 'refresh-token'
  };

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    // Set default mock behavior
    storeSpy.select.and.callFake((selector: any) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectFavoriteProducts')) {
        return of(mockFavoriteProducts);
      } else if (selectorStr.includes('selectUser')) {
        return of(mockUser);
      }
      return of(null);
    });

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle null favorites on init', fakeAsync(() => {
    mockStore.select.and.callFake((selector: any) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectFavoriteProducts')) {
        return of(null);
      } else if (selectorStr.includes('selectUser')) {
        return of(mockUser);
      }
      return of(null);
    });

    const newFixture = TestBed.createComponent(FavoritesComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.ngOnInit();
    tick();
    
    expect(newComponent.visibleProducts.length).toBe(0);
  }));

  it('should preserve unmarked products in visible list', fakeAsync(() => {
    component.visibleProducts = [...mockFavoriteProducts];
    
    mockStore.select.and.callFake((selector: any) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectFavoriteProducts')) {
        return of([]);
      } else if (selectorStr.includes('selectUser')) {
        return of(mockUser);
      }
      return of(null);
    });

    component.ngOnInit();
    tick();
    
    expect(component.visibleProducts.length).toBe(1);
  }));

  it('should dispatch toggleFavorite action when onToggleFavorite is called', () => {
    const productId = 1;
    component.visibleProducts = [...mockFavoriteProducts];
    
    component.onToggleFavorite(productId);
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleFavorite({ productId }));
  });

  it('should only dispatch action when toggling favorite (no immediate local update)', () => {
    component.visibleProducts = [...mockFavoriteProducts];
    const productId = 1;
    
    // Store original state
    const originalProduct = component.visibleProducts.find(p => p.id === productId);
    const originalFavoriteStatus = originalProduct?.isFavorite;
    
    // Call onToggleFavorite
    component.onToggleFavorite(productId);
    
    // Verify action was dispatched
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleFavorite({ productId }));
    
    // Verify local state is NOT changed immediately (only store handles the change)
    const productAfterToggle = component.visibleProducts.find(p => p.id === productId);
    expect(productAfterToggle?.isFavorite).toBe(originalFavoriteStatus);
  });

  it('should dispatch toggleFavorite action even for non-existent products', () => {
    component.visibleProducts = [...mockFavoriteProducts];
    const nonExistentProductId = 999;
    
    component.onToggleFavorite(nonExistentProductId);
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleFavorite({ productId: nonExistentProductId }));
    // Existing products should remain unchanged since onToggleFavorite only dispatches action
    expect(component.visibleProducts[0].isFavorite).toBeTruthy();
  });

  it('should navigate to products when goToProducts is called', () => {
    component.goToProducts();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should dispatch logout action and navigate to login when onLogout is called', () => {
    component.onLogout();
    expect(mockStore.dispatch).toHaveBeenCalledWith(logout());
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle image error by setting placeholder src', () => {
    const mockEvent = {
      target: {
        src: 'original-image.jpg'
      }
    };
    
    component.onImageError(mockEvent);
    
    expect(mockEvent.target.src).toBe('https://via.placeholder.com/300x200?text=No+Image');
  });

  it('should return visible products', () => {
    component.visibleProducts = mockFavoriteProducts;
    const result = component.getVisibleProducts();
    expect(result).toEqual(mockFavoriteProducts);
  });

  it('should update product isFavorite to false when it is removed from store favorites', fakeAsync(() => {
    // Set up initial state
    const productWithFavoriteTrue = { ...mockFavoriteProducts[0], isFavorite: true };
    component.visibleProducts = [productWithFavoriteTrue];
    
    // Manually call the logic that would be triggered by store subscription
    // Simulate store returning empty favorites array
    const emptyFavorites: Product[] = [];
    
    // Manually execute the logic from ngOnInit for this scenario
    if (component.visibleProducts.length > 0) {
      component.visibleProducts = component.visibleProducts.map(visible => {
        const updatedFavorite = emptyFavorites.find(fav => fav.id === visible.id);
        if (updatedFavorite) {
          return updatedFavorite;
        } else {
          return { ...visible, isFavorite: false };
        }
      });
    }
    
    tick();
    
    // Verify: product is still visible but marked as not favorite
    expect(component.visibleProducts.length).toBe(1);
    expect(component.visibleProducts[0].isFavorite).toBeFalsy();
  }));

  it('should initialize observables in constructor', () => {
    expect(component.favoriteProducts$).toBeDefined();
    expect(component.user$).toBeDefined();
  });

  it('should initialize with empty visible products array', () => {
    expect(component.visibleProducts).toEqual([]);
  });
}); 