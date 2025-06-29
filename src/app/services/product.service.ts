import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../store/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsResponse> {
    // Use public endpoint - no auth required
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`);
  }

  getAuthenticatedProducts(): Observable<ProductsResponse> {
    // Use authenticated endpoint if needed
    const token = this.getAuthToken();
    if (!token) {
      // Fallback to public endpoint if no token
      return this.getProducts();
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<ProductsResponse>(`${this.apiUrl}/auth/products`, { headers });
  }

  private getAuthToken(): string {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.token;
      } catch {
        return '';
      }
    }
    return '';
  }
} 