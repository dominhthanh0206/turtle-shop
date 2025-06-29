import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { ProductsResponse } from '../store/models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProductsResponse: ProductsResponse = {
    products: [
      {
        id: 1,
        title: 'Test Product',
        description: 'Test Description',
        category: 'test',
        price: 99.99,
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
        images: ['test-image.jpg'],
        thumbnail: 'test-thumbnail.jpg',
        isFavorite: false
      }
    ],
    total: 1,
    skip: 0,
    limit: 30
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products from public endpoint', () => {
    service.getProducts().subscribe(response => {
      expect(response).toEqual(mockProductsResponse);
    });

    const req = httpMock.expectOne('https://dummyjson.com/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductsResponse);
  });

  it('should get authenticated products when token exists', () => {
    // Set up user data in localStorage
    const userData = {
      token: 'test-token'
    };
    localStorage.setItem('user', JSON.stringify(userData));

    service.getAuthenticatedProducts().subscribe(response => {
      expect(response).toEqual(mockProductsResponse);
    });

    const req = httpMock.expectOne('https://dummyjson.com/auth/products');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockProductsResponse);
  });

  it('should fallback to public endpoint when no token exists', () => {
    // No token in localStorage
    service.getAuthenticatedProducts().subscribe(response => {
      expect(response).toEqual(mockProductsResponse);
    });

    const req = httpMock.expectOne('https://dummyjson.com/products');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    req.flush(mockProductsResponse);
  });

  it('should fallback to public endpoint when user data is invalid JSON', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('user', 'invalid-json');

    service.getAuthenticatedProducts().subscribe(response => {
      expect(response).toEqual(mockProductsResponse);
    });

    const req = httpMock.expectOne('https://dummyjson.com/products');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    req.flush(mockProductsResponse);
  });

  it('should return empty string when no user data exists', () => {
    const token = (service as any).getAuthToken();
    expect(token).toBe('');
  });

  it('should return token when valid user data exists', () => {
    const userData = {
      token: 'valid-token'
    };
    localStorage.setItem('user', JSON.stringify(userData));

    const token = (service as any).getAuthToken();
    expect(token).toBe('valid-token');
  });

  it('should return empty string when JSON parsing fails', () => {
    localStorage.setItem('user', 'invalid-json');

    const token = (service as any).getAuthToken();
    expect(token).toBe('');
  });

  it('should handle HTTP errors', () => {
    service.getProducts().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('https://dummyjson.com/products');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
}); 