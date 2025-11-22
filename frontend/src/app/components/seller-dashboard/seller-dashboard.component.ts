import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product, MOCK_PRODUCTS } from '../../models/product.model';
import { CATEGORIES } from '../../models/categories.model';
import { AuthService } from '../../services/auth.service';
import { MediaService } from '../../services/media.service';

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
  // imagePreview: string | ArrayBuffer | null = null;
  imagePreviews: { file: File | null, dataUrl: string}[] = [];
  isDragActive: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private mediaService: MediaService) {
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

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    Array.from(files).forEach(file => {
      // Duplicate? Ask service!
      if (this.mediaService.isAlreadySelected(file, this.imagePreviews)) {
        this.imageValidationError = 'This image has already been selected.';
        setTimeout(() => this.imageValidationError = null, 3000);
        return;
      }
      // Validate type
      if (!this.mediaService.allowedProductImageTypes.includes(file.type)) {
        this.imageValidationError = 'Only JPG and PNG files are allowed.';
        setTimeout(() => this.imageValidationError = null, 3000);
        return;
      }
      // Validate size
      if (file.size > this.mediaService.maxImageSize) {
        this.imageValidationError = 'Image size must be under 2MB.';
        setTimeout(() => this.imageValidationError = null, 3000);
        return;
      }
      // If all good, show preview
      const reader = new FileReader();
      reader.onload = () =>
        this.imagePreviews.push({ file, dataUrl: reader.result as string });
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  moveImageUp(index: number): void {
  if (index === 0) return;
  [this.imagePreviews[index-1], this.imagePreviews[index]] =
    [this.imagePreviews[index], this.imagePreviews[index-1]];
  }

  moveImageDown(index: number): void {
    if (index === this.imagePreviews.length-1) return;
    [this.imagePreviews[index+1], this.imagePreviews[index]] =
      [this.imagePreviews[index], this.imagePreviews[index+1]];
  }

  // For drag & drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragActive = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragActive = false;
    if (event.dataTransfer?.files) {
      this.onFilesSelected({ target: { files: event.dataTransfer.files } });
    }
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
      images: this.imagePreviews.length ? this.imagePreviews.map(p => p.dataUrl) : [],
      category: 'uncategorized',
      sellerId: currentUserId,
      quantity: 1,
    };
    this.userProducts.push(newProduct);
    this.productForm.reset();
    this.imagePreviews = [];
  }

  resetForm() {
    this.productForm.reset();
    this.imagePreviews = [];
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
    this.imagePreviews = product.images?.map(url => ({ file: null, dataUrl: url })) || [];
  }

  deleteProduct(index: number) {
    this.userProducts.splice(index, 1);
  }
}
