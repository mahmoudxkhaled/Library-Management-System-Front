import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class DahboardService {

  constructor(private apiService: ApiService) { }

  getDashboardData(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/Dashboard/getDashboardData');
  }
}