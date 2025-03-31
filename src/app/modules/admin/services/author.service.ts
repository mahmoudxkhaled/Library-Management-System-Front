import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private apiService: ApiService) { }

  getAllAuthors():Observable<ApiResult>
  {
   return this.apiService.getAllRequest("/Author");
  }
}