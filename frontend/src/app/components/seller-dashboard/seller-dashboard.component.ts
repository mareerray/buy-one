import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product, MOCK_PRODUCTS } from '../../models/product.model';
import { CATEGORIES } from '../../models/categories.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css'],
})

export class SellerDashboardComponent implements OnInit {

  userProducts: Product[] = [];
  productForm: FormGroup;
  categories = CATEGORIES;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1.00)]],
      image: [null, Validators.required],
      category: [this.categories.length > 0 ? this.categories[0].id : '', Validators.required], // default to first category id
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    const currentUserId = this.authService.currentUserValue?.id;
    if (currentUserId) {
      this.userProducts = MOCK_PRODUCTS.filter(product => product.sellerId === currentUserId);
    }
  }

  maxImageSize = 2 * 1024 * 1024; // 2MB in bytes equals 2,097,152 bytes 
  allowedTypes = ['image/jpeg', 'image/png'];  // Only allow jpeg and png
  imageValidationError: string | null = null;

  onImageChange(event: any) {
    const file = event.target.files[0];
    console.log('File size in bytes:', file.size);
    this.imageValidationError = null;

  if (file) {
    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.imageValidationError = 'Only JPG and PNG files are allowed.';
      this.productForm.patchValue({ image: null });
      this.imagePreview = null;
      console.log('Rejected due to type');
      return;
    }

    // Validate file size
    if (file.size > this.maxImageSize) {
      this.imageValidationError = 'Image size must be under 2MB.';
      this.productForm.patchValue({ image: null });
      this.imagePreview = null;
      return;
    }

    // If valid, update form and preview
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

  resetForm() {
    this.productForm.reset();
    this.imagePreview = null;
    this.imageValidationError = null;
    // (Optionally, cancel editing state if you track edited index)
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
