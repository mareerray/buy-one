import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product, MOCK_PRODUCTS } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seller-dashboard.html',
  styleUrls: ['./seller-dashboard.css'],
})

export class SellerDashboardComponent implements OnInit {

  userProducts: Product[] = [];
  productForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1.00)]],
      image: [null, Validators.required],
    });
  }

  ngOnInit() {
    const currentUserId = this.authService.currentUserValue?.id;
    if (currentUserId) {
      this.userProducts = MOCK_PRODUCTS.filter(product => product.sellerId === currentUserId);
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.productForm.patchValue({ image: null });
    this.imagePreview = null;
  }

  submitProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const currentUserId = this.authService.currentUserValue?.id;
    if (!currentUserId) return;

    const newProduct: Product = {
      id: (MOCK_PRODUCTS.length + 1).toString(),
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      images: this.imagePreview? [this.imagePreview.toString()] : [],
      category: 'uncategorized',
      sellerId: currentUserId,
      quantity: 1,
    };
    this.userProducts.push(newProduct);
    this.productForm.reset();
    this.imagePreview = null;
  }

  editProduct(index: number) {
    const product = this.userProducts[index];
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      image: null
    });
    this.imagePreview = product.images?.[0] || null;
  }

  deleteProduct(index: number) {
    this.userProducts.splice(index, 1);
  }
}
