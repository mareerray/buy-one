import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { LoginRequest } from '../models/users/loginRequest.model';
import { RegisterUserRequest } from '../models/users/registerUserRequest.model';
import { LoginResponse } from '../models/users/loginResponse.model'; // Create this
import { UserResponse } from '../models/users/userResponse.model'; // Create this

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = 'https://localhost:8080/auth';
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(this.loadUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private loadUserFromStorage(): UserResponse | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? (JSON.parse(userJson) as UserResponse) : null;
  }

  updateCurrentUserInStorage(user: UserResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private saveAuthData(token: string, user: UserResponse): void {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  get currentUserValue(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isSeller(): boolean {
    return this.currentUserValue?.role === 'SELLER';
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response) => {
        this.saveAuthData(response.token, response.user);
      }),
    );
  }

  signup(userData: RegisterUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/register`, userData).pipe(
      tap((user) => {
        this.saveAuthData('', user); // No token from register (adjust if backend sends one)
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
}
