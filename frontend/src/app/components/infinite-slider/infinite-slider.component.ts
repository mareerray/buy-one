import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  // Make a new array that repeats sellers, e.g. 3x
  get extendedSellers() {
    return [...this.sellers, ...this.sellers, ...this.sellers, ...this.sellers];
  }
  get extendedProducts() {
    return [...this.products, ...this.products, ...this.products, ...this.products];
  }
}
