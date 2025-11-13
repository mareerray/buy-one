import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor
import { FormsModule } from '@angular/forms';  // for ngModel (template-driven forms)
import { MOCK_PRODUCTS } from '../../models/product.model';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sellerId: string;
  quantity: number;
}

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductListingComponent implements OnInit {
  products: Product[] = [];

  // @Input() products: Product[] = [];
  @Input() onProductClick: (product: Product) => void = () => {};
  @Input() onSellerClick: (sellerId: string) => void = () => {};

  searchQuery: string = '';
  categoryFilter: string = 'all';
  sortBy: string = 'name';

  ngOnInit() {
    this.products = MOCK_PRODUCTS;
  }

  get categories(): string[] {
    return ['all', ...Array.from(new Set(this.products.map(p => p.category)))];
  }

  get filteredProducts(): Product[] {
    return this.products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          || product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.categoryFilter === 'all' || product.category === this.categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'price-low': return a.price - b.price;
          case 'price-high': return b.price - a.price;
          default: return 0;
        }
      });
  }

  handleAddToCart(product: Product) {
    alert(`${product.name} added to cart!`);
  }
}
