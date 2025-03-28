import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private apiService: ApiService) { }

  getAllBooks(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/Book/GetAllBooks');
  }

  getBookById(id: string): Observable<ApiResult> {
    return this.apiService.getByIdRequest<ApiResult>('/Book/GetBookById', id);
  }

  addBook(request: FormData): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>('/Book/AddBook', request);
  }

  updateBook(request: FormData): Observable<ApiResult> {
    return this.apiService.putRequest<ApiResult>('/Book/UpdateBook', request);
  }

  deleteBook(id: string): Observable<ApiResult> {
    return this.apiService.deleteRequest<ApiResult>('/Book/DeleteBook', id);
  }

  activateOrDeactivateBook(id: string): Observable<ApiResult> {
    return this.apiService.putByIdRequest<ApiResult>('/Book/ActivateOrDeactivateBook', id);
  }
}