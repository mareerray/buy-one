import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/users/user-response.model';
import { UserUpdateRequest } from '../../models/users/userUpdateRequest.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { MediaService } from '../../services/media.service';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  currentUser: UserResponse | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  avatar: string | null = null;
  avatarError: string = '';
  uploadProgress = 0;
  successMessage = '';
  showSuccess = false;

  userService = inject(UserService);
  mediaService = inject(MediaService);
  authService = inject(AuthService);

  fb = inject(FormBuilder);

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordsMatch },
    );
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({ name: user.name, email: user.email });
        // Disable email field
        this.profileForm.get('email')?.disable();
        this.avatar = user.avatar || null;
      }
    });
  }

  onAvatarSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.avatarError = '';
    this.uploadProgress = 0;

    // Preview instantly
    const reader = new FileReader();
    reader.onloadend = () => {
      this.avatar = reader.result as string;
      this.avatarError = '';
    };
    reader.readAsDataURL(file);

    // Upload via MediaService
    this.mediaService.uploadAvatar(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 0;
        }
      },
      error: (err) => {
        this.avatarError =
          typeof err === 'string' ? err : err.message || 'Failed to upload avatar.';
        this.uploadProgress = 0;
      },
    });
  }

  handleRemoveAvatar() {
    this.avatar = 'assets/avatars/user-default.png';
    this.avatarError = '';
    this.uploadProgress = 0;
  }

  saveProfile() {
    if (this.profileForm.valid && this.currentUser) {
      this.successMessage = '';

      const dto: UserUpdateRequest = {
        id: this.currentUser.id,
        name: this.profileForm.value.name,
        // email: this.profileForm.value.email,
        avatar: this.avatar || this.currentUser.avatar,
        // password not included here
      };
      this.userService.updateCurrentUser(dto).subscribe({
        next: (updatedUser) => {
          this.currentUser = updatedUser;
          this.profileForm.patchValue({
            name: updatedUser.name,
            // email: updatedUser.email,
          });
          // keep AuthService / navbar in sync
          this.authService.updateCurrentUserInStorage(updatedUser); // navbar updates
          this.successMessage = 'Profile updated successfully!';
          this.showSuccess = true;
          console.log('Profile updated successfully');
        },
        error: (err) => {
          console.error('Failed to update profile', err);
        },
      });
    }
  }

  changePassword() {
    if (this.passwordForm.valid && this.currentUser) {
      this.successMessage = '';

      const dto: UserUpdateRequest = {
        id: this.currentUser.id,
        name: this.currentUser.name, // keep unchanged
        // email: this.currentUser.email, // keep unchanged
        avatar: this.currentUser.avatar,
        password: this.passwordForm.value.newPassword,
      };
      this.userService.updateCurrentUser(dto).subscribe({
        next: (updatedUser) => {
          this.currentUser = updatedUser;
          this.passwordForm.reset();
          this.successMessage = 'Password changed successfully!';
          this.showSuccess = true;
          console.log('Password updated successfully');
        },
        error: (err) => {
          console.error('Failed to update password', err);
        },
      });
    }
  }

  private passwordsMatch(form: AbstractControl) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }
}
