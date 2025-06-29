import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', (done) => {
    mockStore.select.and.returnValue(of(true));

    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should deny access and redirect to login when user is not authenticated', (done) => {
    mockStore.select.and.returnValue(of(false));

    guard.canActivate().subscribe(result => {
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });

  it('should only take the first value from the store', (done) => {
    let emissionCount = 0;
    mockStore.select.and.returnValue(of(true, false, true)); // Multiple values

    guard.canActivate().subscribe(result => {
      emissionCount++;
      expect(result).toBe(true); // Should only get the first value
      expect(emissionCount).toBe(1); // Should only emit once
      done();
    });
  });
}); 