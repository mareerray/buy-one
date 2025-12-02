import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, MOCK_PRODUCTS } from '../models/products/product.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private productsSubject = new BehaviorSubject<Product[]>([]);

  private productsSubject = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);

  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor() {}

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(map((products) => products.find((p) => p.id === id)));
  }

  getProductsBySeller(sellerId: string): Product[] {
    return this.productsSubject.value.filter((p) => p.sellerId === sellerId);
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.productsSubject.value.filter((p) => p.categoryId === categoryId);
  }

  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, product]);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex((p) => p.id === id);

    if (index !== -1) {
      currentProducts[index] = { ...currentProducts[index], ...updates };
      this.productsSubject.next([...currentProducts]);
    }
  }

  deleteProduct(id: string): void {
    const currentProducts = this.productsSubject.value.filter((p) => p.id !== id);
    this.productsSubject.next(currentProducts);
  }
}

// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { CreateProductRequest } from '../models/createProductRequest.model';
// import { UpdateProductRequest } from '../models/updateProductRequest.model';
// import { ProductResponse } from '../models/productResponse.model';
// import { ApiResponse } from '../models/api-response.model';

// @Injectable({ providedIn: 'root' })
// export class ProductService {
//   private http = inject(HttpClient);
//   private baseUrl = 'http://localhost:8080/api/products';

//   private productsSubject = new BehaviorSubject<ProductResponse[]>([]);
//   products$ = this.productsSubject.asObservable();

//   // GET all products
//   getProducts(): Observable<ProductResponse[]> {
//     return this.http
//       .get<ProductResponse[]>(this.baseUrl)
//       .pipe(tap((products) => this.productsSubject.next(products)));
//   }

//   // GET product by ID
//   getProductById(productId: string): Observable<ProductResponse> {
//     return this.http.get<ProductResponse>(`${this.baseUrl}/${productId}`);
//   }

//   // GET products by Seller
//   getProductsBySeller(sellerId: string): Observable<ProductResponse[]> {
//     return this.http.get<ProductResponse[]>(`${this.baseUrl}?sellerId=${sellerId}`);
//   }

//   // GET products by Category
//   getProductsByCategory(categoryId: string): Observable<ProductResponse[]> {
//     return this.http.get<ProductResponse[]>(`${this.baseUrl}?categoryId=${categoryId}`);
//   }

//   // POST create product
//   addProduct(
//     req: CreateProductRequest,
//     sellerId: string,
//     role: string = 'SELLER',
//   ): Observable<ApiResponse<ProductResponse>> {
//     return this.http
//       .post<
//         ApiResponse<ProductResponse>
//       >(this.baseUrl, req, { headers: { 'X-USER-ID': sellerId, 'X-USER-ROLE': role } })
//       .pipe(
//         tap((resp) => {
//           if (resp.data) {
//             const existingProducts = this.productsSubject.value;
//             this.productsSubject.next([...existingProducts, resp.data]);
//           }
//         }),
//       );
//   }

//   // PUT update product
//   updateProduct(
//     productId: string,
//     req: UpdateProductRequest,
//     sellerId: string,
//     role: string = 'SELLER',
//   ): Observable<ApiResponse<ProductResponse>> {
//     return this.http
//       .put<
//         ApiResponse<ProductResponse>
//       >(`${this.baseUrl}/${productId}`, req, { headers: { 'X-USER-ID': sellerId, 'X-USER-ROLE': role } })
//       .pipe(
//         tap((resp) => {
//           if (resp.data) {
//             const products = this.productsSubject.value;
//             const index = products.findIndex((p) => p.id === resp.data!.id);
//             if (index !== -1) {
//               const updatedList = [...products];
//               updatedList[index] = resp.data;
//               this.productsSubject.next(updatedList);
//             }
//           }
//         }),
//       );
//   }

//   // DELETE product
//   deleteProduct(
//     productId: string,
//     sellerId: string,
//     role: string = 'SELLER',
//   ): Observable<ApiResponse<void>> {
//     return this.http
//       .delete<
//         ApiResponse<void>
//       >(`${this.baseUrl}/${productId}`, { headers: { 'X-USER-ID': sellerId, 'X-USER-ROLE': role } })
//       .pipe(
//         tap(() => {
//           const existingProducts = this.productsSubject.value;
//           const remainingProducts = existingProducts.filter((p) => p.id !== productId);
//           this.productsSubject.next(remainingProducts);
//         }),
//       );
//   }
// }
