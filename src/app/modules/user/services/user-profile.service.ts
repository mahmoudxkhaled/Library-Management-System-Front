import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api-service.service';
import { ApiResult } from 'src/app/core/models/ApiResult';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private apiService: ApiService) { }

  getUserTransactionss(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>(`/Transaction/MyBorrowHistory`);
  }
}
