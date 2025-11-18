import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MediaService } from '../../../services/media.service';
import { HttpEventType} from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule} from '@angular/material/radio';


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
      MatRadioModule
    ]
})
export class SignUpComponent {
    @Output() signUp = new EventEmitter<{
    name: string;
    email: string;
    password: string;
    role: 'client' | 'seller';
    avatar?: string;
  }>();
    @Output() switchToSignIn = new EventEmitter<void>();

    uploadProgress = 0;
    avatar: string = '';
    avatarError: string = '';
    showAvatar: boolean = false;

    form: FormGroup;

    constructor(private fb: FormBuilder, private mediaService: MediaService) {
    this.form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')
      ]],
      confirmPassword: ['', Validators.required],
      role: ['client', Validators.required]
    }, { validators: SignUpComponent.matchPasswords });
  }

    static matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  handleAvatarUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.avatarError = '';
    this.uploadProgress = 0;

    // Local preview with FileReader immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      this.avatar = reader.result as string;
      this.showAvatar = true;
      this.avatarError = '';
    };
    reader.readAsDataURL(file);

    // Upload with mediaService
    this.mediaService.uploadAvatar(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress = 0;
        }
      },
      error: (err) => {
        this.avatarError = typeof err === 'string' ? err : err.message || 'Failed to upload avatar. Please try again.';
        this.uploadProgress = 0;
      }
    });
  }

  handleRemoveAvatar() {
    this.avatar = 'assets/avatars/user-default.png';
    this.showAvatar = false;
    this.avatarError = '';
    this.uploadProgress = 0;
  }

  submit() {
    if (this.form.invalid) return;
    const { name, email, password, role } = this.form.value;
    this.signUp.emit({
      name: name!,
      email: email!,
      password: password!,
      role: role!,
      avatar: this.avatar
    });
  }
}
