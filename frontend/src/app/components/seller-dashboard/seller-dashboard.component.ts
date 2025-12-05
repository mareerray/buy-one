import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Product, MOCK_PRODUCTS } from '../../models/products/product.model';
import { CATEGORIES } from '../../models/categories/categories.model';
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
  sellerName: string = '';
  sellerAvatar: string = '';
  showModal: boolean = false;
  editIndex: number | null = null;
  userProducts: Product[] = [];
  productForm: FormGroup;
  categories = CATEGORIES;
  // imagePreview: string | ArrayBuffer | null = null;
  imagePreviews: { file: File | null; dataUrl: string }[] = [];
  isDragActive: boolean = false;

  mediaService = inject(MediaService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1.0)]],
      image: [null, Validators.required],
      categoryId: [this.categories.length > 0 ? this.categories[0].id : '', Validators.required], // default to first category id
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userProducts = MOCK_PRODUCTS.filter((product) => product.sellerId === currentUser.id);
      this.sellerName = currentUser.name;
      this.sellerAvatar = currentUser.avatar || 'assets/avatars/default-user.jpg'; // or whatever field holds avatar url
    }
    // const currentUserId = this.authService.currentUserValue?.id;
    // if (currentUserId) {
    //   this.userProducts = MOCK_PRODUCTS.filter((product) => product.sellerId === currentUserId);
    // }
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
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const currentUserId = this.authService.currentUserValue?.id;
    if (!currentUserId) return;

    // Gather form data
    const productData: Product = {
      id: (MOCK_PRODUCTS.length + 1).toString(), // Will only use for new products
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      images: this.imagePreviews.length ? this.imagePreviews.map((p) => p.dataUrl) : [],
      categoryId: this.productForm.value.categoryId || 'uncategorized',
      sellerId: currentUserId,
      quantity: this.productForm.value.quantity ?? 1,
    };

    if (this.editIndex !== null) {
      // Edit mode: update existing product
      // Keep the product's original ID and sellerId
      const oldProduct = this.userProducts[this.editIndex];
      this.userProducts[this.editIndex] = {
        ...oldProduct,
        ...productData,
        id: oldProduct.id, // Ensure ID stays consistent
        sellerId: oldProduct.sellerId,
      };
      this.editIndex = null;
    } else {
      // Add new product
      this.userProducts.push(productData);
    }

    this.productForm.reset();
    this.imagePreviews = [];
  }

  cancelEdit() {
    this.productForm.reset();
    this.imagePreviews = [];
    this.imageValidationError = null;
    this.editIndex = null;
    this.showModal = false;
    // (Optionally, cancel editing state if you track edited index)
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
    this.userProducts.splice(index, 1);
  }
}
