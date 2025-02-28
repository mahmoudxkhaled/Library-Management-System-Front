import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private apiService: ApiService) { }

  getAllFeedbacks(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/Feedback/GetAllFeedbacks');
  }

  addFeedback(request: FormData): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>('/Feedback/AddFeedback', request);
  }
}