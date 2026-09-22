import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);

  submitted = signal(false);
  loading = this.auth.isLoggedIn;
  showPassword = signal(false);
  error = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
    password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(72)]],
  });

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/products';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.notifications.showError('Erreur lors de la tentative de connexion');
      },
    });
  }
}
