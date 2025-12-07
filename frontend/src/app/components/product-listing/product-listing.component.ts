import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor
import { FormsModule } from '@angular/forms'; // for ngModel (template-driven forms)
import { MOCK_PRODUCTS, Product } from '../../models/products/product.model';
import { MOCK_USERS, User } from '../../models/users/user.model';
import { Router } from '@angular/router';
import { ProductGridCardComponent } from '../product-grid-card/product-grid-card.component';
import { CATEGORIES } from '../../models/categories/category.model';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ProductGridCardComponent],
})
export class ProductListingComponent implements OnInit {
  products: Product[] = [];
  category = CATEGORIES;
  searchQuery: string = '';
  categoryFilter: string = 'all';
  sortBy: string = 'name';

  categories: string[] = [];
  filteredProducts: Product[] = [];
  categoryOptions: { id: string; name: string }[] = [];

  private router = inject(Router); //

  ngOnInit() {
    this.products = MOCK_PRODUCTS;
    this.initializeCategories();
    this.initializeCategoryOptions();
    this.updateFilteredProducts();
  }

  private initializeCategories() {
    this.categories = ['all', ...Array.from(new Set(this.products.map((p) => p.categoryId)))];
  }

  private initializeCategoryOptions() {
    this.categoryOptions = this.category.map((c) => ({ id: c.id, name: c.name }));
  }

  // Call this whenever filters change
  updateFilteredProducts() {
    this.filteredProducts = this.products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory =
          this.categoryFilter === 'all' || product.categoryId === this.categoryFilter;
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

  getCategoryName(categoryId: string): string {
    const cat = this.category.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToCart(productId: string) {
    alert('Add to Cart feature coming soon!');
    console.log('add to cart', productId);
  }

  // These methods call when user changes filters
    onSearchChange() {
      this.updateFilteredProducts();
    }

    onCategoryChange() {
      this.updateFilteredProducts();
    }

    onSortChange() {
      this.updateFilteredProducts();
    }
}
