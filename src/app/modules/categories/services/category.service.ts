import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiService: ApiService) { }

  getAllCategories(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/Category/GetAllCategories');
  }

  getCategoryById(id: string): Observable<ApiResult> {
    return this.apiService.getByIdRequest<ApiResult>(`/Category/GetCategoryById`, id);
  }

  addCategory(request: FormData): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>('/Category/AddCategory', request);
  }

  updateCategory(request: FormData): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>('/Category/UpdateCategory', request);
  }

  deleteCategory(id: string): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>(`/Category/DeleteCategory/${id}`, null);
  }
}