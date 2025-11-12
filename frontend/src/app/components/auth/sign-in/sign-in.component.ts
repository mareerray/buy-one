import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

// Import the Material modules you use in this component
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    standalone: true,
    imports: [
        RouterModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NgIf
    ]
})
export class SignInComponent implements OnInit {
    signInForm: FormGroup;
    errorMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.signInForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        // Redirect if already logged in
        if (this.authService.isAuthenticated()) {
        this.router.navigate(['/']);
        }
    }

    onSubmit(): void {
        if (this.signInForm.valid) {
        this.isLoading = true;
        this.errorMessage = '';

        const { email, password } = this.signInForm.value;
        const result = this.authService.login(email, password);

        this.isLoading = false;

        if (result.success) {
            console.log("Login successful");
            const user = this.authService.currentUserValue;
            if (user?.role === 'seller') {
            this.router.navigate(['/seller/dashboard']);
            } else {
            this.router.navigate(['/']);
            }
        } else {
            this.errorMessage = result.message || 'Login failed';
        }
        }
    }

    get email() {
        return this.signInForm.get('email');
    }

    get password() {
        return this.signInForm.get('password');
    }
}