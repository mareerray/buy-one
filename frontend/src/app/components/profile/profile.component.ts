import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserDTO } from '../../models/userDTO.model';
import { UserUpdateDTO } from '../../models/userUpdateDTO.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule]
 })

export class ProfileComponent implements OnInit {
  currentUser: UserDTO | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  avatarPreview: string | null = null;

    constructor(private authService: AuthService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatch });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({ name: user.name, email: user.email });
        this.avatarPreview = user.avatar || null;
      }
    });
  }

    onAvatarSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => this.avatarPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  saveProfile() {
    if (this.profileForm.valid && this.currentUser) {
      const dto: UserUpdateDTO = {
        id: this.currentUser.id,
        name: this.profileForm.value.name,
        email: this.profileForm.value.email,
        avatar: this.avatarPreview || this.currentUser.avatar
        // password not included here
      };
      this.authService.updateUser(dto);
    }
  }

  changePassword() {
    if (this.passwordForm.valid && this.currentUser) {
      const dto: UserUpdateDTO = {
        id: this.currentUser.id,
        name: this.currentUser.name, // keep unchanged
        email: this.currentUser.email, // keep unchanged
        avatar: this.currentUser.avatar,
        password: this.passwordForm.value.newPassword
      };
      this.authService.updateUser(dto);
    }
  }

  private passwordsMatch(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }
}
