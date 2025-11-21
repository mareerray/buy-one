import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Observable, of } from 'rxjs';
import { MOCK_USERS, User } from '../../models/user.model'; 

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.css'],
    imports: [CommonModule],
})
export class ProductCardComponent implements OnInit {
    productId: string | null = null;
    product$: Observable<Product | undefined> = of(undefined);

    constructor(private route: ActivatedRoute, private productService: ProductService) {}

    ngOnInit() {
        this.productId = this.route.snapshot.paramMap.get('id');
        if (this.productId) {
            this.product$ = this.productService.getProductById(this.productId);
            // Now product$ will emit the product or undefined
        }
    }

    getSeller(sellerId: string): User | undefined {
        return MOCK_USERS.find(user => user.id === sellerId && user.role === 'seller');
    }

    goBack() {
        window.history.back();
    }

    nextProduct(currentProductId: string) {
        this.productService.getProducts().subscribe(products => {
            const currentIndex = products.findIndex(p => p.id === currentProductId);
            const nextIndex = (currentIndex + 1) % products.length;
            const nextProductId = products[nextIndex].id;
            // Navigate to the next product
            window.location.href = `/product/${nextProductId}`;
        });
    }
}