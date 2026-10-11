import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { USER_ROLES, User, UserRole, UserStatus } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { formatApiError } from '../../../core/utils/api-error.util';
import { roleLabel } from '../../../core/utils/role-label.util';

@Component({
  selector: 'app-user-detail',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  protected readonly statuses: UserStatus[] = ['active', 'inactive'];
  protected readonly roles = USER_ROLES;
  protected readonly roleLabel = roleLabel;
  protected readonly user = signal<User | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly putLoading = signal(false);
  protected readonly deleteLoading = signal(false);
  protected readonly actionMessage = signal('');
  protected readonly actionError = signal('');

  protected readonly putForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.maxLength(20)],
    status: ['active' as UserStatus, Validators.required],
    role: ['employee' as UserRole, Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading.set(false);
      this.errorMessage.set('Invalid user id');
      return;
    }

    this.loadUser(id);
  }

  submitPut(): void {
    const current = this.user();
    if (!current || this.putForm.invalid) {
      return;
    }

    const { phoneNumber, name, email, status, role } = this.putForm.getRawValue();
    const payload = this.auth.isAdmin()
      ? {
          name,
          email,
          phoneNumber: phoneNumber.trim() || undefined,
          status,
          role,
        }
      : {
          name,
          email,
          phoneNumber: phoneNumber.trim() || undefined,
        };

    this.putLoading.set(true);
    this.clearActionFeedback();

    this.userService.updateUser(current.id, payload).subscribe({
      next: (user) => this.handleUserUpdated(user, 'Changes saved.'),
      error: (error) => this.handleActionError(error, 'Update failed'),
      complete: () => this.putLoading.set(false),
    });
  }

  deleteUser(): void {
    const current = this.user();
    if (!current) {
      return;
    }

    if (!confirm(`Delete user "${current.name}"?`)) {
      return;
    }

    this.deleteLoading.set(true);
    this.clearActionFeedback();

    this.userService.deleteUser(current.id).subscribe({
      next: () => {
        this.deleteLoading.set(false);
        void this.router.navigate(['/users'], {
          state: { message: 'User deleted successfully.' },
        });
      },
      error: (error) => {
        this.deleteLoading.set(false);
        this.actionError.set(formatApiError(error, 'Delete failed'));
      },
    });
  }

  private loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.syncPutForm(user);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(formatApiError(error, 'Failed to load user'));
      },
    });
  }

  private syncPutForm(user: User): void {
    this.putForm.patchValue({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber ?? '',
      status: user.status,
      role: user.role ?? 'employee',
    });
  }

  private handleUserUpdated(user: User, message: string): void {
    this.user.set(user);
    this.syncPutForm(user);
    this.auth.refreshSessionUser(user);
    this.actionMessage.set(message);
  }

  private handleActionError(error: unknown, fallback: string): void {
    this.actionError.set(formatApiError(error, fallback));
  }

  private clearActionFeedback(): void {
    this.actionMessage.set('');
    this.actionError.set('');
  }
}
