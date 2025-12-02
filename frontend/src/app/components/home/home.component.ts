import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../ui/hero/hero.component';
import { MOCK_PRODUCTS } from '../../models/products/product.model';
import { MOCK_USERS } from '../../models/users/user.model';
import { CATEGORIES } from '../../models/categories/categories.model';
import { InfiniteSliderComponent } from '../ui/infinite-slider/infinite-slider.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, InfiniteSliderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  categories = CATEGORIES;

  // Format sellers for the slider - INCLUDE ID
  sliderSellers = MOCK_USERS.filter((user) => user.role === 'seller').map((seller) => ({
    id: seller.id,
    avatar: seller.avatar ?? 'assets/avatars/user-default.png',
    name: seller.name,
  }));

  // Format products for the slider - INCLUDE ID
  sliderProducts = MOCK_PRODUCTS.map((product) => ({
    id: product.id,
    image: Array.isArray(product.images) ? product.images[0] : product.images,
  }));

  ngOnInit() {
    console.log('sliderSellers in HomeComponent:', this.sliderSellers);
    console.log('sliderProducts in HomeComponent:', this.sliderProducts);
  }
  onCategoryClick(categorySlug: string): void {
    this.router.navigate(['/categories', categorySlug]);
  }

  shopNow() {}
  registerSeller() {}
  browseCreators() {}
}
