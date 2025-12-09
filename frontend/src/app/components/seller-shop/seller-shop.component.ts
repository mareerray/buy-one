import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductGridCardComponent } from '../product-grid-card/product-grid-card.component';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../models/products/product-response.model';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/users/user-response.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/categories/category.model';

@Component({
  selector: 'app-seller-shop',
  templateUrl: './seller-shop.component.html',
  styleUrls: ['./seller-shop.component.css'],
  standalone: true,
  imports: [CommonModule, ProductGridCardComponent],
})
export class SellerShopComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private categoryService = inject(CategoryService);

  seller: UserResponse | undefined;
  sellerProducts: ProductResponse[] = [];
  categories: Category[] = [];

  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit() {
    // Get seller ID from route parameter
    const sellerId = this.route.snapshot.paramMap.get('id');

    if (sellerId) {
      this.loadSeller(sellerId);
      this.loadSellerProducts(sellerId);
      this.loadCategories();
    } else {
      this.errorMessage = 'No Seller specified.';
    }
  }

  private loadSeller(sellerId: string) {
    this.userService.getUserById(sellerId).subscribe({
      next: (user) => {
        if (user && user.role === 'SELLER') {
          this.seller = user;
        } else {
          this.errorMessage = 'Seller not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Could not load seller.';
      },
    });
  }

  private loadSellerProducts(sellerId: string) {
    this.isLoading = true;
    this.productService.getProductsBySeller(sellerId).subscribe({
      next: (prods) => {
        this.sellerProducts = prods;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load seller products.';
        this.isLoading = false;
      },
    });
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => {},
    });
  }

  getCategoryName(categoryId: string): string {
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat ? cat.slug : categoryId; // or cat.name
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToCart() {
    alert('Add to Cart feature coming soon!');
  }

  sendMessage() {
    // Placeholder for messaging functionality
    alert('Messaging feature coming soon!');
  }
}
