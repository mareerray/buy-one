import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../models/products/product-response.model';
import { CreateProductRequest } from '../../models/products/createProductRequest.model';
import { UpdateProductRequest } from '../../models/products/updateProductRequest.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/categories/category.model';

import { AuthService } from '../../services/auth.service';
import { MediaService } from '../../services/media.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css'],
})
export class SellerDashboardComponent implements OnInit {
  private router = inject(Router);
  private mediaService = inject(MediaService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  userProducts: ProductResponse[] = [];
  categories: Category[] = [];
  isLoadingProducts = false;
  isLoadingCategories = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  sellerName: string = '';
  sellerAvatar: string = '';
  showModal: boolean = false;
  editIndex: number | null = null;

  productForm: FormGroup;
  // imagePreview: string | ArrayBuffer | null = null;
  imagePreviews: { file: File | null; dataUrl: string }[] = [];
  isDragActive: boolean = false;

  fb = inject(FormBuilder);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1.0)]],
      image: [null],
      categoryId: [this.categories.length > 0 ? this.categories[0].id : '', Validators.required], // default to first category id
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || currentUser.role !== 'SELLER') {
      this.router.navigate(['/']);
      return;
    }

    this.sellerName = currentUser.name;
    this.sellerAvatar = currentUser.avatar || 'assets/avatars/default-user.jpg';
    this.loadCategories();
    this.loadSellerProducts(currentUser.id);
  }

  private loadCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        // Set default category in the form
        if (this.categories.length > 0 && !this.productForm.get('categoryId')?.value) {
          this.productForm.patchValue({ categoryId: this.categories[0].id });
        }
        this.isLoadingCategories = false;
      },
      error: () => {
        console.error('Error loading categories:');
        this.isLoadingCategories = false;
        this.errorMessage = 'Could not load categories.';
      },
    });
  }

  private loadSellerProducts(sellerId: string) {
    this.isLoadingProducts = true;
    this.productService.getProductsBySeller(sellerId).subscribe({
      next: (products) => {
        this.userProducts = products;
        this.isLoadingProducts = false;
      },
      error: () => {
        console.error('Error loading seller products:');
        this.isLoadingProducts = false;
        this.errorMessage = 'Could not load your products.';
      },
    });
  }

  maxImageSize = 2 * 1024 * 1024; // 2MB in bytes equals 2,097,152 bytes
  allowedTypes = ['image/jpeg', 'image/png']; // Only allow jpeg and png
  imageValidationError: string | null = null;

  viewMyShop() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role === 'SELLER') {
      this.router.navigate(['/seller-shop', currentUser.id]);
    }
  }
  openAddProductModal() {
    this.editIndex = null; // Null means "add mode" (not editing)
    this.productForm.reset(); // Blank form
    this.imagePreviews = []; // Clear any images
    this.imageValidationError = null; // Clear any errors

    // Re-apply default category (first category = Code & Nerd Humor)
    if (this.categories.length > 0) {
      this.productForm.patchValue({
        categoryId: this.categories[0].id,
      });
    }
    this.showModal = true;
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    Array.from(files).forEach((file) => {
      // Duplicate? Ask service!
      if (this.mediaService.isAlreadySelected(file, this.imagePreviews)) {
        this.imageValidationError = 'This image has already been selected.';
        setTimeout(() => (this.imageValidationError = null), 3000);
        return;
      }
      // Validate type
      if (!this.mediaService.allowedProductImageTypes.includes(file.type)) {
        this.imageValidationError = 'Only JPG and PNG files are allowed.';
        setTimeout(() => (this.imageValidationError = null), 3000);
        return;
      }
      // Validate size
      if (file.size > this.mediaService.maxImageSize) {
        this.imageValidationError = 'Image size must be under 2MB.';
        setTimeout(() => (this.imageValidationError = null), 3000);
        return;
      }
      // If all good, show preview
      const reader = new FileReader();
      reader.onload = () => this.imagePreviews.push({ file, dataUrl: reader.result as string });
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  moveImageUp(index: number): void {
    if (index === 0) return;
    [this.imagePreviews[index - 1], this.imagePreviews[index]] = [
      this.imagePreviews[index],
      this.imagePreviews[index - 1],
    ];
  }

  moveImageDown(index: number): void {
    if (index === this.imagePreviews.length - 1) return;
    [this.imagePreviews[index + 1], this.imagePreviews[index]] = [
      this.imagePreviews[index],
      this.imagePreviews[index + 1],
    ];
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

  get selectedCategoryId(): string {
    return this.productForm.get('categoryId')?.value;
  }

  getCategoryById(id: string) {
    return this.categories.find((cat) => cat.id === id);
  }

  submitProduct() {
    console.log('submitProduct called', this.productForm.value);
    console.log('form valid?', this.productForm.valid, this.productForm.errors);
    if (this.productForm.invalid) {
      console.log('form invalid, controls:', {
        name: this.productForm.get('name')?.errors,
        description: this.productForm.get('description')?.errors,
        price: this.productForm.get('price')?.errors,
        quantity: this.productForm.get('quantity')?.errors,
        categoryId: this.productForm.get('categoryId')?.errors,
        image: this.productForm.get('image')?.errors,
      });
      this.productForm.markAllAsTouched();
      return;
    }
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const images = this.imagePreviews.length ? this.imagePreviews.map((p) => p.dataUrl) : [];
    if (this.imagePreviews.length === 0) {
      this.imageValidationError = 'Please add at least one image.';
      return;
    }

    if (this.editIndex !== null) {
      // Edit mode: update existing product
      // Keep the product's original ID and userId
      const existing = this.userProducts[this.editIndex];
      const payload: UpdateProductRequest = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
        categoryId: this.productForm.value.categoryId,
        images,
      };

      this.productService.updateProduct(existing.id, payload, currentUser.id, 'SELLER').subscribe({
        next: (resp) => {
          console.log('Update product success', resp);
          this.successMessage = 'Product updated successfully';
          this.loadSellerProducts(currentUser.id);
          this.closeModal();
        },
        error: (err) => {
          console.error('Update product failed', err);
        },
      });
    } else {
      // Add mode: create new product
      const payload: CreateProductRequest = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
        categoryId: this.productForm.value.categoryId,
        images,
      };

      this.productService.addProduct(payload, currentUser.id, 'SELLER').subscribe({
        next: (resp) => {
          console.log('Create product success', resp);
          this.successMessage =
            this.editIndex !== null
              ? 'Product updated successfully'
              : 'Product created successfully';
          this.loadSellerProducts(currentUser.id);
          this.closeModal(); // Reset and hide modal
        },
        error: (err) => {
          console.error('Create product failed', err);
        },
      });
    }
  }

  closeModal() {
    this.productForm.reset();
    this.imagePreviews = [];
    this.imageValidationError = null;
    this.editIndex = null;
    this.showModal = false;
  }

  editProduct(index: number) {
    const product = this.userProducts[index];
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      image: null,
      categoryId: product.categoryId,
      quantity: product.quantity,
    });
    this.imagePreviews = product.images?.map((url) => ({ file: null, dataUrl: url })) || [];
    this.editIndex = index;
    this.showModal = true;
  }

  deleteProduct(index: number) {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const product = this.userProducts[index];

    this.productService.deleteProduct(product.id, currentUser.id, 'SELLER').subscribe({
      next: () => {
        this.userProducts.splice(index, 1); // or reloadSellerProducts
      },
    });
  }
}
