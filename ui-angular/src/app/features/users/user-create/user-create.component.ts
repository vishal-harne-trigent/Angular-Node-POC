import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { USER_ROLES, UserStatus } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { formatApiError } from '../../../core/utils/api-error.util';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly statuses: UserStatus[] = ['active', 'inactive'];
  protected readonly roles = USER_ROLES;
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.maxLength(20)],
    status: ['active' as UserStatus, Validators.required],
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

    this.userService.createUser(payload).subscribe({
      next: (user) => {
        this.loading.set(false);
        void this.router.navigate(['/users', user.id]);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(formatApiError(error, 'Failed to create user'));
      },
    });
  }
}
