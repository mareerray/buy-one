import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { MockUsersService } from '../services/mock-users.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    // private productsSubject = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);
        private productsSubject = new BehaviorSubject<Product[]>([]);

    public products$: Observable<Product[]> = this.productsSubject.asObservable();

    constructor() {}

    getProducts(): Observable<Product[]> {
        return this.products$;
    }

    getProductById(id: string): Product | undefined {
        return this.productsSubject.value.find(p => p.id === id);
    }

    getProductsBySeller(sellerId: string): Product[] {
        return this.productsSubject.value.filter(p => p.sellerId === sellerId);
    }

    getProductsByCategory(category: string): Product[] {
        return this.productsSubject.value.filter(p => p.category === category);
    }

    addProduct(product: Product): void {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, product]);
    }

    updateProduct(id: string, updates: Partial<Product>): void {
        const currentProducts = this.productsSubject.value;
        const index = currentProducts.findIndex(p => p.id === id);
        
        if (index !== -1) {
        currentProducts[index] = { ...currentProducts[index], ...updates };
        this.productsSubject.next([...currentProducts]);
        }
    }

    deleteProduct(id: string): void {
        const currentProducts = this.productsSubject.value.filter(p => p.id !== id);
        this.productsSubject.next(currentProducts);
    }
}