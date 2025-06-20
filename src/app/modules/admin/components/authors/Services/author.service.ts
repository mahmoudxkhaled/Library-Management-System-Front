import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api-service.service';
import { AuthorParams } from '../Models/AuthorParams';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private apiService:ApiService) { }
    getAuthorsPaged(first:number,rows:number,AuthorParams:AuthorParams):Observable<ApiResult>
    {
     return this.apiService.postRequest<ApiResult>(`/author/${first}/${rows}`,AuthorParams)
    }
    ActivateOrDeactivateAuthor(authorId:number):Observable<any>
    {
      return this.apiService.putRequest<ApiResult>(`/author/ActivateOrDeactivateAuthor/${authorId}`,null)
    }
    addAuthor(authorForm:any):Observable<ApiResult>
    {
      return this.apiService.postRequest<ApiResult>(`/author`,authorForm);
    }
    ExportToExcelWithoutParams()
    {
      return this.apiService.ExportToExcelWithoutParams('/author/ExportToExcel');
    }
    deleteAuthor(autherId:number):Observable<ApiResult>
    {
      return this.apiService.deleteRequest<ApiResult>(`/author`,autherId);
    }
    updateAuthor(authorForm:any):Observable<any>
    {
      return this.apiService.putRequest(`/author`,authorForm);
    }
 
}
