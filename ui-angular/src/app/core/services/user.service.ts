import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateUserRequest, DeleteUserResponse, UpdateUserRequest, User} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getUsers() {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  createUser(payload: CreateUserRequest) {
    return this.http.post<User>(this.baseUrl, payload);
  }

  updateUser(id: number, payload: UpdateUserRequest) {
    return this.http.put<User>(`${this.baseUrl}/${id}`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete<DeleteUserResponse>(`${this.baseUrl}/${id}`);
  }
}
