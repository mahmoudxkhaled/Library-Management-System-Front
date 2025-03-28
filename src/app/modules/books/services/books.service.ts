import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReadBookDto } from '../models/ReadBookDto';
import { PagedResult } from 'src/app/shared/Models/PagedResult';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api-service.service';
import { ApiResult } from 'src/app/core/models/ApiResult';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private apiService: ApiService) { }
  getBooksPaged(first:number,rows:number,sortOrder:number,search:string=null):Observable<ApiResult>
  {
   return this.apiService.getAllRequest<ApiResult>(`/Book/${first}/${rows}/${sortOrder}/${search}`)
  }
}
