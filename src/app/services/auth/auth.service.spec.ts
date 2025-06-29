import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from '../../store/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send login request with correct credentials', () => {
    const mockCredentials: LoginRequest = {
      username: 'testuser',
      password: 'testpass'
    };

    const mockResponse: LoginResponse = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      email: 'test@example.com',
      gender: 'male',
      image: 'image.jpg',
      token: 'test-token',
      refreshToken: 'refresh-token'
    };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://dummyjson.com/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    const mockCredentials: LoginRequest = {
      username: 'invaliduser',
      password: 'invalidpass'
    };

    service.login(mockCredentials).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne('https://dummyjson.com/auth/login');
    req.flush('Invalid credentials', { status: 400, statusText: 'Bad Request' });
  });
}); 