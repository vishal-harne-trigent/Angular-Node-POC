import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { formatApiError } from '../../../core/utils/api-error.util';
import { roleLabel } from '../../../core/utils/role-label.util';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  protected readonly roleLabel = roleLabel;

  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(formatApiError(error, 'Failed to load users'));
      },
    });
  }
}
