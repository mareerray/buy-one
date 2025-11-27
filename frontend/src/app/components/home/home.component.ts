import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../ui/hero/hero.component';
// import { CategoriesComponent } from '../categories/categories.component';
// import { ProductListingComponent } from '../product-listing/product-listing.component';
import { MOCK_PRODUCTS } from '../../models/product.model';
import { MOCK_USERS } from '../../models/user.model';
import { InfiniteSliderComponent } from '../ui/infinite-slider/infinite-slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    // CategoriesComponent,
    // ProductListingComponent,
    InfiniteSliderComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
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

  shopNow() {}
  registerSeller() {}
  browseCreators() {}
}
