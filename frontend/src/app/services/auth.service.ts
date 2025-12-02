import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/users/user.model';
import { ResponseUser } from '../models/users/responseUser.model';
import { UserUpdateRequest } from '../models/users/userUpdateRequest.model';
import { MOCK_USERS, authenticateUser } from '../models/users/user.model';
import { getUserByEmail, updateUser } from '../models/users/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<ResponseUser | null>(this.loadUserFromStorage());
  public currentUser$: Observable<ResponseUser | null> = this.currentUserSubject.asObservable();

  constructor() {}

  private loadUserFromStorage(): ResponseUser | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? (JSON.parse(userJson) as ResponseUser) : null;
  }

  login(email: string, password: string): { success: boolean; message?: string } {
    const user = authenticateUser(email, password);

    if (user) {
      const { ...ResponseUser } = user;
      localStorage.setItem('currentUser', JSON.stringify(ResponseUser));
      this.currentUserSubject.next(ResponseUser as ResponseUser);
      console.log(ResponseUser);
      return { success: true };
    }

    return { success: false, message: 'Invalid credentials' };
  }

  signup(userData: Partial<User>): { success: boolean; message?: string } {
    const existingUser = getUserByEmail(userData.email!);

    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email!,
      password: userData.password!,
      name: userData.name!,
      role: userData.role || 'client',
      avatar: userData.avatar || '',
    };
    MOCK_USERS.push(newUser);

    const { ...ResponseUser } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(ResponseUser));
    this.currentUserSubject.next(ResponseUser as ResponseUser);
    return { success: true };
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): ResponseUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isSeller(): boolean {
    return this.currentUserValue?.role === 'seller';
  }

  updateUser(update: UserUpdateRequest) {
    const updated = updateUser(update);
    if (updated) {
      const { ...ResponseUser } = updated;
      this.currentUserSubject.next(ResponseUser as ResponseUser);
    }
  }
}
