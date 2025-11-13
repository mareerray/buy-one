import { Routes } from '@angular/router';
import { HomeComponent} from './components/home/home.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'signin', pathMatch: 'full' }, // Default to 'signin'
  { path: '', component: HomeComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent },
];


