import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { MessageService } from 'primeng/api';
import { login } from '../../store/auth/auth.actions';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    // Setup store selectors to return default values
    storeSpy.select.and.returnValue(of(false)); // Default to not authenticated, no loading, no error

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when username is empty', () => {
    component.loginForm.patchValue({ username: '', password: 'password' });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should mark form as invalid when password is empty', () => {
    component.loginForm.patchValue({ username: 'username', password: '' });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should mark form as valid when both fields are filled', () => {
    component.loginForm.patchValue({ username: 'testuser', password: 'testpass' });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should dispatch login action when form is submitted with valid data', () => {
    const credentials = { username: 'testuser', password: 'testpass' };
    component.loginForm.patchValue(credentials);
    
    component.onSubmit();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(login({ credentials }));
  });

  it('should not dispatch login action when form is invalid', () => {
    component.loginForm.patchValue({ username: '', password: '' });
    
    component.onSubmit();
    
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should check if field is invalid', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.markAsTouched();
    usernameControl?.setErrors({ required: true });

    expect(component.isFieldInvalid('username')).toBeTruthy();
  });

  it('should return false when field is valid', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.markAsTouched();
    usernameControl?.setValue('testuser');

    expect(component.isFieldInvalid('username')).toBeFalsy();
  });

  it('should return false when field is not touched', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.setErrors({ required: true });

    expect(component.isFieldInvalid('username')).toBeFalsy();
  });

  it('should return false when field does not exist', () => {
    expect(component.isFieldInvalid('nonexistent')).toBeFalsy();
  });

  it('should mark all form controls as touched when form is invalid on submit', () => {
    component.loginForm.patchValue({ username: '', password: '' });
    
    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');
    
    spyOn(usernameControl!, 'markAsTouched');
    spyOn(passwordControl!, 'markAsTouched');
    
    component.onSubmit();
    
    expect(usernameControl!.markAsTouched).toHaveBeenCalled();
    expect(passwordControl!.markAsTouched).toHaveBeenCalled();
  });

  it('should navigate to products when authentication is successful', fakeAsync(() => {
    // Mock the store to return authenticated state
    mockStore.select.and.returnValue(of(true));
    
    // Create a new component instance with the updated mock
    const newFixture = TestBed.createComponent(LoginComponent);
    const newComponent = newFixture.componentInstance;
    
    newComponent.ngOnInit();
    tick();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  }));

  it('should not show error message when error is null', fakeAsync(() => {
    // Mock the store to return null error
    mockStore.select.and.callFake((selector: any) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectAuthError')) {
        return of(null);
      }
      return of(false);
    });
    
    // Create a new component instance with the updated mock
    const newFixture = TestBed.createComponent(LoginComponent);
    const newComponent = newFixture.componentInstance;
    
    newComponent.ngOnInit();
    tick();
    
    expect(mockMessageService.add).not.toHaveBeenCalled();
  }));

  it('should initialize observables in constructor', () => {
    expect(component.loading$).toBeDefined();
    expect(component.error$).toBeDefined();
  });
}); 