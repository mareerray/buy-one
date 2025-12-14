import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import { MediaService } from '../../../services/media.service';
import { AuthService } from '../../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf,
    MatRadioModule,
  ],
})
export class SignUpComponent {
  uploadProgress = 0;
  avatar: string = 'assets/avatars/user-default.png';
  avatarError: string = '';
  // showAvatar: boolean = false;
  errorMessage = '';
  isLoading = false;

  form: FormGroup;

  private fb = inject(FormBuilder);
  // private mediaService = inject(MediaService);
  private authService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])'),
          ],
        ],
        confirmPassword: ['', Validators.required],
        role: ['client', Validators.required],
      },
      { validators: SignUpComponent.matchPasswords },
    );
  }

  static matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  submit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password, role } = this.form.value;

    // Transform to match backend RegisterUserRequest
    const payload = {
      name: name!,
      email: email!,
      password: password!,
      role: role.toUpperCase(), // 'client' | 'seller' to 'CLIENT' | 'SELLER'
      avatar: this.avatar,
    };

    this.authService.signup(payload).subscribe({
      next: (_user: any) => {
        this.isLoading = false;
        console.log('Sign-up successful', _user);
        // this.signUp.emit(payload); --- IGNORE ---
        this.router.navigate(['/signin']);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Sign-up failed. Please try again.';
        console.error('Sign-up error', error);
      },
    });
  }

  // handleAvatarUpload(event: Event) {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (!file) return;

  //   this.avatarError = '';
  //   this.uploadProgress = 0;

  //   // Local preview with FileReader immediately
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     this.avatar = reader.result as string;
  //     this.showAvatar = true;
  //     this.avatarError = '';
  //   };
  //   reader.readAsDataURL(file);

  //   // Upload with mediaService
  //   this.mediaService.uploadAvatar(file).subscribe({
  //     next: (res) => {
  //       // res is ApiResponse<MediaResponse>
  //       const media = res.data;
  //       this.avatar = media.url; // backend URL
  //       this.uploadProgress = 0;
  //     },
  //     error: (err) => {
  //       this.avatarError =
  //         typeof err === 'string'
  //           ? err
  //           : err.message || 'Failed to upload avatar. Please try again.';
  //       this.uploadProgress = 0;
  //     },
  //   });
  // }

  // handleRemoveAvatar() {
  //   this.avatar = 'assets/avatars/user-default.png';
  //   this.showAvatar = false;
  //   this.avatarError = '';
  //   this.uploadProgress = 0;
  // }
}
