import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor
import { CATEGORIES } from '../../models/categories.model';
import { MOCK_PRODUCTS } from '../../models/product.model';
import { MOCK_USERS, User } from '../../models/user.model';
import { ProductGridCardComponent } from '../product-grid-card/product-grid-card.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, ProductGridCardComponent],
})
export class CategoriesComponent {
  private router = inject(Router);
  categories = CATEGORIES;
  products = MOCK_PRODUCTS;
  selectedCategoryId = this.categories[0].id;
  // private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const categoryFromUrl = params.get('category');
      if (categoryFromUrl && this.categories.some((cat) => cat.id === categoryFromUrl)) {
        this.selectedCategoryId = categoryFromUrl;
      }
    });
  }

  selectCategory(id: string) {
    this.selectedCategoryId = id;
  }

  get selectedCategory() {
    return this.categories.find((cat) => cat.id === this.selectedCategoryId);
  }

  get filteredProducts() {
    return this.products.filter((p) => p.category === this.selectedCategoryId);
  }

  getSeller(sellerId: string): User | undefined {
    // Returns the User object for the seller
    return MOCK_USERS.find((user) => user.id === sellerId && user.role === 'seller');
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToCart() {
    alert('Add to Cart feature coming soon!');
  }
}
