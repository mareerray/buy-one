import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // for ngClass, ngIf, ngFor
import { Category } from '../../models/categories/category.model';
import { MOCK_PRODUCTS } from '../../models/products/product.model';
import { MOCK_USERS, User } from '../../models/users/user.model';
import { ProductGridCardComponent } from '../product-grid-card/product-grid-card.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, ProductGridCardComponent],
})
export class CategoriesComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  // categories = CATEGORIES;
  products = MOCK_PRODUCTS;

  selectedCategorySlug: string | null = null;
  // selectedCategorySlug = this.categories[0].slug;

  constructor() {
    // 1) Load categories from backend
    this.categoryService.getCategories().subscribe((cats) => {
      this.categories = cats;

      // If nothing selected yet, pick first one
      if (!this.selectedCategorySlug && this.categories.length > 0) {
        this.selectedCategorySlug = this.categories[0].slug;
      }
    });

    // 2) Listen to route slug
    this.route.paramMap.subscribe((params) => {
      const slugFromUrl = params.get('slug');
      if (slugFromUrl && this.categories.some((cat) => cat.slug === slugFromUrl)) {
        this.selectedCategorySlug = slugFromUrl;
      }
    });
  }
  // constructor() {
  //   this.route.paramMap.subscribe((params) => {
  //     const slugFromUrl = params.get('slug');
  //     if (slugFromUrl && this.categories.some((cat) => cat.slug === slugFromUrl)) {
  //       this.selectedCategorySlug = slugFromUrl;
  //     }
  //   });
  // }

  selectCategory(slug: string) {
    this.selectedCategorySlug = slug;
    this.router.navigate(['/categories', slug]);
  }

  get selectedCategory() {
    if (!this.selectedCategorySlug) return undefined;
    return this.categories.find((cat) => cat.slug === this.selectedCategorySlug);
  }

  get filteredProducts() {
    const cat = this.selectedCategory;
    if (!cat) return [];
    return this.products.filter((p) => p.categoryId === cat.id);
  }

  getSeller(sellerId: string): User | undefined {
    // Returns the User object for the seller
    return MOCK_USERS.find((user) => user.id === sellerId && user.role === 'seller');
  }

  getCategoryName(categoryId: string): string {
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToCart() {
    alert('Add to Cart feature coming soon!');
  }
}
