import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/categories/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8567/categories'; // <-- use product-service port

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  // GET all categories
  // Sends GET /api/categories to the backend and returns an Observable of category array
  // tap(...) is used for side effect that updates categoriesSubject to ensure
  // the in-memory list matches the backend
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
}
