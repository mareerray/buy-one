import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserUpdateRequest } from '../models/users/userUpdateRequest.model';
import { UserResponse } from '../models/users/user-response.model';
import { ApiResponse } from '../models/api-response/api-response.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:8080/api/users';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateCurrentUser(update: UserUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/me`, update, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getSellers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/sellers`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserById(userId: string) {
    return this.http
      .get<ApiResponse<UserResponse>>(`${this.baseUrl}/${userId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((resp) => resp.data));
  }
}
