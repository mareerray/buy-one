import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor
import { CATEGORIES } from '../../models/categories.model';
import { MOCK_PRODUCTS } from '../../models/product.model';
import { ProductImageCarouselComponent } from '../ui/product-image-carousel/product-image-carousel.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, ProductImageCarouselComponent],
})
export class CategoriesComponent {
  private router = inject(Router);
  categories = CATEGORIES;
  products = MOCK_PRODUCTS;
  selectedCategoryId = this.categories[0].id;

  selectCategory(id: string) {
    this.selectedCategoryId = id;
  }

  get filteredProducts() {
    return this.products.filter((p) => p.category === this.selectedCategoryId);
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToCart() {
    alert('Add to Cart feature coming soon!');
  }
}
