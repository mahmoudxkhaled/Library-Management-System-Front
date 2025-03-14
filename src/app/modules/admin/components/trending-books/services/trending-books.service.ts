import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class TrendingBooksService {

  constructor(private apiService: ApiService) { }

  getAllTrendingBooks(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/TrendingBooks/GetAllTrendingBooks');
  }

  incrementTrendingBook(bookId: string): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>(`/TrendingBooks/IncrementTrendingBook/${bookId}`, null);
  }
}