import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';
import { IUser } from '../models/IUser';
import { IUserLogged } from '../models/UserLogged';
import { Router } from '@angular/router';
import { UpdateUserProfileDto } from 'src/app/modules/user/models/UpdateUserProfileDto ';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService,private router:Router) { }

  GetCurrentUserDetails():Observable<ApiResult>
  {
    return this.apiService.getAllRequest<ApiResult>('/User/GetCurrentUserDetails')
  }
  getLoggedInUser():IUserLogged
  {
    return JSON.parse(localStorage.getItem("userData"));
  }
  updateLoggedUser(userData:IUserLogged)
  {
    localStorage.removeItem('userData');
    localStorage.setItem('userData',JSON.stringify(userData))
  }
  changePassword(changePasswordDto:any)
  {
    return this.apiService.postRequest('/User/changePassword',changePasswordDto)
  }
  Logout()
  {
    localStorage.removeItem('userData')
    this.router.navigate(['/auth/login']);
  }
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
  register(request: any): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>('/User/register', request);
  }
  UpdateUserProfile(UpdateUserProfile:any)
  {    
    return this.apiService.putRequest<ApiResult>('/User', UpdateUserProfile);
  }
}