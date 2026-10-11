import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { USER_ROLES } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { formatApiError } from '../../../core/utils/api-error.util';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly roles = USER_ROLES;
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phoneNumber: ['', Validators.maxLength(20)],
    role: ['employee' as const, Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { phoneNumber, ...rest } = this.form.getRawValue();
    const payload = phoneNumber.trim() ? { ...rest, phoneNumber: phoneNumber.trim() } : rest;

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Account created. Redirecting to login…');
        setTimeout(() => {
          void this.router.navigate(['/login']);
        }, 1200);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(formatApiError(error, 'Registration failed'));
      },
    });
  }
}
