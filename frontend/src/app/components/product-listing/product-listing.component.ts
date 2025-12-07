import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductGridCardComponent } from '../product-grid-card/product-grid-card.component';
import { CATEGORIES } from '../../models/categories/category.model';
import { MOCK_USERS, User } from '../../models/users/user.model';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../models/products/product-response.model';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ProductGridCardComponent],
})
export class ProductListingComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);

  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];

  category = CATEGORIES;
  searchQuery = '';
  categoryFilter = 'all';
  sortBy = 'name';

  categories: string[] = [];
  categoryOptions: { id: string; name: string }[] = [];

  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
        this.initializeCategories();
        this.initializeCategoryOptions();
        this.updateFilteredProducts();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load products.';
        this.isLoading = false;
      },
    });
  }

  private initializeCategories() {
    this.categories = ['all', ...Array.from(new Set(this.products.map((p) => p.categoryId)))];
  }

  private initializeCategoryOptions() {
    this.categoryOptions = this.category.map((c) => ({ id: c.id, name: c.name }));
  }

  updateFilteredProducts() {
    this.filteredProducts = this.products
      .filter((product) => {
        const q = this.searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
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

  getSeller(userId: string): User | undefined {
    return MOCK_USERS.find((user) => user.id === userId && user.role === 'seller');
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
