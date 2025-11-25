import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { CategoriesComponent } from '../categories/categories.component';
// import { ProductListingComponent } from '../product-listing/product-listing.component';
import { Product, MOCK_PRODUCTS } from '../../models/product.model';
import { MOCK_USERS } from '../../models/user.model';
import { InfiniteSliderComponent } from '../infinite-slider/infinite-slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    CategoriesComponent,
    // ProductListingComponent,
    InfiniteSliderComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  sellers = MOCK_USERS.filter((user) => user.role === 'seller');
  products: Product[] = MOCK_PRODUCTS;

  // Format sellers for the slider
  sliderSellers = this.sellers.map((seller) => ({
    avatar: seller.avatar ?? 'assets/avatars/user-default.png',
    name: seller.name,
  }));

  // Format products for the slider (use the FIRST image for each product)
  sliderProducts = this.products.map((product) => ({
    image: Array.isArray(product.images) ? product.images[0] : product.images,
  }));

  ngOnInit() {
    console.log('sliderSellers in HomeComponent:', this.sliderSellers);
  }

  shopNow() {}
  registerSeller() {}
  browseCreators() {}
}
