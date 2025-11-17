import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserDTO } from '../models/userDTO.model';
import { UserUpdateDTO } from '../models/userUpdateDTO.model';
import { MOCK_USERS, authenticateUser, getUserByEmail, updateUser } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<UserDTO | null>(
    this.loadUserFromStorage()
    );
    public currentUser$: Observable<UserDTO | null> = this.currentUserSubject.asObservable();

    constructor() {}

    private loadUserFromStorage(): UserDTO | null {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) as UserDTO : null;
    }

    login(email: string, password: string): { success: boolean; message?: string } {
        const user = authenticateUser(email, password);

        if (user) {
        const { password, ...userDTO } = user;
        localStorage.setItem('currentUser', JSON.stringify(userDTO));
        this.currentUserSubject.next(userDTO as UserDTO);
        console.log(userDTO);
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

        const { password, ...userDTO } = newUser;
        localStorage.setItem('currentUser', JSON.stringify(userDTO));
        this.currentUserSubject.next(userDTO as UserDTO);
        return { success: true };
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    get currentUserValue(): UserDTO | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.currentUserValue;
    }

    isSeller(): boolean {
        return this.currentUserValue?.role === 'seller';
    }

    updateUser(update: UserUpdateDTO) {
    const updated = updateUser(update);
    if (updated) {
        const { password, ...userDTO } = updated;
        this.currentUserSubject.next(userDTO as UserDTO);
    }
  }
}