import { Routes } from '@angular/router';
import { HomeComponent} from './components/home/home.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'signin', pathMatch: 'full' }, // Default to 'signin'
  { path: '', component: HomeComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
];


// import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';
// import { SellerGuard } from './guards/seller.guard';

// import { HomeComponent } from './components/home/home.component';
// import { SignInComponent } from './components/auth/sign-in/sign-in.component';
// import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
// import { ProductListingComponent } from './components/products/product-listing/product-listing.component';
// import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
// import { SellerDashboardComponent } from './components/seller/seller-dashboard/seller-dashboard.component';
// import { SellerProfileComponent } from './components/seller/seller-profile/seller-profile.component';
// import { ProductManagementComponent } from './components/seller/product-management/product-management.component';
// import { AboutComponent } from './components/about/about.component';

// export const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'signin', component: SignInComponent },
//   { path: 'signup', component: SignUpComponent },
//   { path: 'products', component: ProductListingComponent },
//   { path: 'products/:id', component: ProductDetailComponent },
//   { path: 'about', component: AboutComponent },
//   { 
//     path: 'seller/dashboard', 
//     component: SellerDashboardComponent,
//     canActivate: [AuthGuard, SellerGuard]
//   },
//   { 
//     path: 'seller/profile', 
//     component: SellerProfileComponent,
//     canActivate: [AuthGuard, SellerGuard]
//   },
//   { 
//     path: 'seller/products', 
//     component: ProductManagementComponent,
//     canActivate: [AuthGuard, SellerGuard]
//   },
//   { path: '**', redirectTo: '' }
// ];
