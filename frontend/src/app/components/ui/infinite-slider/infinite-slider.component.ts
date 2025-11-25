import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-infinite-slider',
  templateUrl: './infinite-slider.component.html',
  styleUrls: ['./infinite-slider.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class InfiniteSliderComponent {
  @Input() sellers: { avatar: string; name: string }[] = [];
  @Input() products: { image: string }[] = [];
  private router = inject(Router);

  // Make a new array that repeats sellers, e.g. 3x
  get extendedSellers() {
    return [...this.sellers, ...this.sellers, ...this.sellers, ...this.sellers];
  }
  get extendedProducts() {
    return [...this.products, ...this.products, ...this.products, ...this.products];
  }

  shopNow() {
    this.router.navigate(['/product-listing']);
  }

  browseCollections() {
    this.router.navigate(['/categories']);
  }
}
