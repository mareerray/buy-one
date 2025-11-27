import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MOCK_PRODUCTS, Product } from '../../models/product.model';
import { MOCK_USERS, User } from '../../models/user.model';
import { ProductGridCardComponent } from '../product-grid-card/product-grid-card.component';

@Component({
  selector: 'app-seller-shop',
  templateUrl: './seller-shop.component.html',
  styleUrls: ['./seller-shop.component.css'],
  standalone: true,
  imports: [CommonModule, ProductGridCardComponent],
})
export class SellerShopComponent implements OnInit {
  seller: User | undefined;
  sellerProducts: Product[] = [];
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    // Get seller ID from route parameter
    const sellerId = this.route.snapshot.paramMap.get('id');

    if (sellerId) {
      // Find seller from MOCK_USERS
      this.seller = MOCK_USERS.find((user) => user.id === sellerId && user.role === 'seller');

      // Filter products by this seller
      this.sellerProducts = MOCK_PRODUCTS.filter((product) => product.sellerId === sellerId);
    }
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToCart() {
    alert('Add to Cart feature coming soon!');
  }

  getSeller(sellerId: string): User | undefined {
    // Returns the User object for the seller
    return MOCK_USERS.find((user) => user.id === sellerId && user.role === 'seller');
  }

  sendMessage() {
    // Placeholder for messaging functionality
    alert('Messaging feature coming soon!');
  }
}
