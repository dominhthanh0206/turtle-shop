import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { MessageService } from 'primeng/api';
import { loadProducts, toggleFavorite } from '../../store/products/products.actions';
import { logout } from '../../store/auth/auth.actions';
import { Product } from '../../store/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Test Product 1',
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
      isFavorite: false
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

    // Setup default store selectors
    storeSpy.select.and.callFake((selector: any) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectAllProducts')) {
        return of(mockProducts);
      } else if (selectorStr.includes('selectFavoriteProducts')) {
        return of([]);
      } else if (selectorStr.includes('selectProductsLoading')) {
        return of(false);
      } else if (selectorStr.includes('selectProductsError')) {
        return of(null);
      } else if (selectorStr.includes('selectUser')) {
        return of(mockUser);
      }
      return of(null);
    });

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadProducts action on init', () => {
    // Reset dispatch calls to check only ngOnInit dispatch
    mockStore.dispatch.calls.reset();
    
    component.ngOnInit();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadProducts());
  });

  it('should dispatch toggleFavorite action when onToggleFavorite is called', () => {
    const productId = 1;
    
    // Reset dispatch calls
    mockStore.dispatch.calls.reset();
    
    component.onToggleFavorite(productId);
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(toggleFavorite({ productId }));
  });

  it('should navigate to favorites when goToFavorites is called', () => {
    component.goToFavorites();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/favorites']);
  });

  it('should dispatch logout action and navigate to login when onLogout is called', () => {
    // Reset dispatch calls
    mockStore.dispatch.calls.reset();
    
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

  it('should reload products when loadProducts is called', () => {
    mockStore.dispatch.calls.reset();
    
    component.loadProducts();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadProducts());
  });

  it('should not show error message when error is null', fakeAsync(() => {
    // Default setup already has null error
    component.ngOnInit();
    tick();

    expect(mockMessageService.add).not.toHaveBeenCalled();
  }));

  it('should handle case when error$ is undefined', fakeAsync(() => {
    // Make error$ undefined
    component.error$ = undefined as any;
    
    // Should not throw error
    expect(() => component.ngOnInit()).not.toThrow();
  }));

  it('should return 0 when favoriteProducts$ is null', fakeAsync(() => {
    // Make favoriteProducts$ null
    component.favoriteProducts$ = null as any;
    
    let count = -1;
    component.getFavoriteCount().subscribe(returnedCount => {
      count = returnedCount;
    });
    
    tick();
    
    expect(count).toBe(0);
  }));

  it('should initialize observables in constructor', () => {
    expect(component.products$).toBeDefined();
    expect(component.favoriteProducts$).toBeDefined();
    expect(component.loading$).toBeDefined();
    expect(component.error$).toBeDefined();
    expect(component.user$).toBeDefined();
  });
}); 