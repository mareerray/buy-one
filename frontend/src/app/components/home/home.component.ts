import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';           // adjust path
import { CategoriesComponent } from '../categories/categories.component'; // adjust path
import { ProductListingComponent } from '../product-listing/product-listing.component'; // adjust path
import { Product, MOCK_PRODUCTS } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, CategoriesComponent, ProductListingComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  products: Product[] = MOCK_PRODUCTS;
  onCategoryClick(categoryId: string) {
    // Optionally filter products or perform navigation
  }
  onProductClick(product: Product) {
    // Show product details
  }
  onSellerClick(sellerId: string) {
    // Show seller info
  }
  onShopNow() {}
  onSellWithUs() {}
  onBrowseCreators() {}
}
