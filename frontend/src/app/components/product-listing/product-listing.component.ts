import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor
import { FormsModule } from '@angular/forms'; // for ngModel (template-driven forms)
import { MOCK_PRODUCTS, Product } from '../../models/product.model';
import { MOCK_USERS, User } from '../../models/user.model';
import { ProductImageCarouselComponent } from '../product-image-carousel/product-image-carousel.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ProductImageCarouselComponent],
})
export class ProductListingComponent implements OnInit {
  products: Product[] = [];
  searchQuery: string = '';
  categoryFilter: string = 'all';
  sortBy: string = 'name';

  ngOnInit() {
    this.products = MOCK_PRODUCTS;
  }

  get categories(): string[] {
    return ['all', ...Array.from(new Set(this.products.map((p) => p.category)))];
  }

  get filteredProducts(): Product[] {
    return this.products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory =
          this.categoryFilter === 'all' || product.category === this.categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }

  getSeller(sellerId: string): User | undefined {
    // Returns the User object for the seller
    return MOCK_USERS.find((user) => user.id === sellerId && user.role === 'seller');
  }

  viewProductDetail(productId: string) {
    const router = inject(Router);
    router.navigate(['/product', productId]);
  }
}
