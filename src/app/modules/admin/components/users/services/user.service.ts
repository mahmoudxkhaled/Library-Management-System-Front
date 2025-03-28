import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) { }

  getAllUsers(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/User/GetAllUsers');
  }

  getUserById(id: string): Observable<ApiResult> {
    return this.apiService.getByIdRequest<ApiResult>('/User/GetUserById', id);
  }

  addUser(request: FormData): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>('/User/AddUserWithDefaultPassword', request);
  }

  updateUser(request: FormData): Observable<ApiResult> {
    return this.apiService.putRequest<ApiResult>('/User/UpdateUser', request);
  }

  deleteUser(id: string): Observable<ApiResult> {
    return this.apiService.deleteRequest<ApiResult>('/User/DeleteUser', id);
  }

  activateOrDeactivateUser(id: string): Observable<ApiResult> {
    return this.apiService.putByIdRequest<ApiResult>('/User/ActivateOrDeactivateUser', id);
  }

  login(request: any): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>('/User/login', request);
  }
}