import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserDTO } from '../models/userDTO.model';
import { MockUsersService } from '../services/mock-users.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<UserDTO | null>(
    this.loadUserFromStorage()
    );
    public currentUser$: Observable<UserDTO | null> = this.currentUserSubject.asObservable();

    constructor(private mockUsersService: MockUsersService) {}

    private loadUserFromStorage(): UserDTO | null {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) as UserDTO : null;
    }

    login(email: string, password: string): { success: boolean; message?: string } {
        const user = this.mockUsersService.mockUsers.find(
        u => u.email === email && u.password === password
        );

        if (user) {
        const { password, ...userDTO } = user;
        localStorage.setItem('currentUser', JSON.stringify(userDTO));
        this.currentUserSubject.next(userDTO as UserDTO);
        return { success: true };
        }

        return { success: false, message: 'Invalid credentials' };
    }

    signup(userData: Partial<User>): { success: boolean; message?: string } {
        const existingUser = this.mockUsersService.mockUsers.find(
            u => u.email === userData.email);
        
        if (existingUser) {
        return { success: false, message: 'Email already registered' };
        }

        const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email!,
        password: userData.password!,
        name: userData.name!,
        role: userData.role || 'client',
        // joinedDate: new Date().toISOString(),
        avatar: userData.avatar || '',
        // phone: userData.phone || '',
        // address: userData.address || '',
        // description: userData.description || '',
        };

        this.mockUsersService.mockUsers.push(newUser);
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
}