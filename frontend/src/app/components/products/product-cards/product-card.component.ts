import { Component, Input,  } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.css'],
    imports: [CommonModule],
})
export class ProductCardComponent {
    @Input() product!: Product;

    constructor(private router: Router) {}

    viewDetails(): void {
        this.router.navigate(['/products', this.product.id]);
    }

    get primaryImage(): string {
        return this.product.images && this.product.images.length > 0
        ? this.product.images[0]
        : 'https://via.placeholder.com/300x400?text=No+Image';
    }
}