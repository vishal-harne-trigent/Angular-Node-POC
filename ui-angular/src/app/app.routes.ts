import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard, selfOrAdminGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { UserCreateComponent } from './features/users/user-create/user-create.component';
import { UserDetailComponent } from './features/users/user-detail/user-detail.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'users',
        component: UserListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'users/new',
        component: UserCreateComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'users/:id',
        component: UserDetailComponent,
        canActivate: [selfOrAdminGuard],
      },
    ],
  },
  { path: '**', redirectTo: 'users' },
];
