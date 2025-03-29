import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReadBookDto } from '../models/ReadBookDto';
import { PagedResult } from 'src/app/shared/Models/PagedResult';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api-service.service';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { BookParams } from '../models/BookParams';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private apiService: ApiService) { }
  getBooksPaged(first:number,rows:number,BookParams:BookParams):Observable<ApiResult>
  {
   return this.apiService.postRequest<ApiResult>(`/Book/${first}/${rows}`,BookParams)
  }
  getBookDetailsById(bookId:number):Observable<ApiResult>
  {
   return this.apiService.getByIdRequest<ApiResult>(`/Book`,bookId);
  }
}
