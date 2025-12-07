import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/products/product.model';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Observable, of } from 'rxjs';
import { MOCK_USERS, User } from '../../models/users/user.model';
import { CATEGORIES } from '../../models/categories/category.model';
import { ProductImageCarouselComponent } from '../ui/product-image-carousel/product-image-carousel.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  imports: [CommonModule, ProductImageCarouselComponent, RouterLink],
})
export class ProductCardComponent implements OnInit {
  productId: string | null = null;
  product$: Observable<Product | undefined> = of(undefined);

  categories = CATEGORIES;

  private route: ActivatedRoute = inject(ActivatedRoute);

  private productService: ProductService = inject(ProductService);

  isFading = false;

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.product$ = this.productService.getProductById(this.productId);
      // Now product$ will emit the product or undefined
    }
  }

  getSeller(sellerId: string): User | undefined {
    return MOCK_USERS.find((user) => user.id === sellerId && user.role === 'seller');
  }

  getCategoryName(categoryId: string): string {
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  }

  addToCart() {
    alert('Add to Cart feature coming soon!');
  }

  goBack() {
    this.isFading = true;
    setTimeout(() => {
      this.isFading = false;
      window.history.back();
    }, 350);
  }

  nextProduct(currentProductId: string) {
    this.isFading = true;
    setTimeout(() => {
      this.isFading = false;
      this.productService.getProducts().subscribe((products) => {
        const currentIndex = products.findIndex((p) => p.id === currentProductId);
        const nextIndex = (currentIndex + 1) % products.length;
        const nextProductId = products[nextIndex].id;
        // Navigate to the next product
        window.location.href = `/product/${nextProductId}`;
      });
    }, 350);
  }
}
