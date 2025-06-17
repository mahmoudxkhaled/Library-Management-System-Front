import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReadBookDto } from '../models/ReadBookDto';
import { PagedResult } from 'src/app/shared/Models/PagedResult';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api-service.service';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { BookParams } from '../models/BookParams';
import { SelectedFilter } from '../../admin/models/SelectedFilters';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private apiService: ApiService) { }
  ExportToExcel(SelectedFilters:SelectedFilter[]): Observable<ArrayBuffer>
  {
    return this.apiService.ExportToExcel(`/Book/ExportToExcel`,SelectedFilters);
  }
  getBooksPaged(first: number, rows: number, BookParams: BookParams): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>(`/Book/${first}/${rows}`, BookParams)
  }
  getBookDetailsById(bookId: number): Observable<ApiResult> {
    return this.apiService.getByIdRequest<ApiResult>(`/Book`, bookId);
  }

  getRelatedBooks(bookId: number): Observable<ApiResult> {
    return this.apiService.getByIdRequest<ApiResult>(`/Book/GetRelatedBooks`, bookId);
  }
  GetAllTrendingBooks(first: number, rows: number, BookParams: BookParams): Observable<ApiResult> 
  {
    return this.apiService.postRequest<ApiResult>(`/TrendingBooks/GetAllTrendingBooks/${first}/${rows}`, BookParams)
  }
   downLoadFile(data: any, type: string, name: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
   
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0)
  }
}
