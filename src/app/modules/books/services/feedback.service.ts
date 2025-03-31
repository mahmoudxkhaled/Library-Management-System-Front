import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api-service.service';
import { ApiResult } from 'src/app/core/models/ApiResult';

export interface AddFeedbackDto {
    userId: number;
    bookId: number;
    rating: number;
    comment: string;
}

export interface GetFeedbackDto {
    id: number;
    userId: number;
    userFirstName: string;
    userLastName: string;
    bookId: number;
    rating: number;
    comment: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    constructor(private apiService: ApiService) { }

    getAllFeedbacks(): Observable<ApiResult> {
        return this.apiService.getAllRequest<ApiResult>('/Feedback/GetAllFeedbacks');
    }

    getAllFeedbacksByBookId(bookId: number): Observable<ApiResult> {
        return this.apiService.getByIdRequest<ApiResult>('/Feedback/GetAllFeedbacksByBookId', bookId);
    }

    addFeedback(feedback: AddFeedbackDto): Observable<ApiResult> {
        return this.apiService.postRequest<ApiResult>('/Feedback/AddFeedback', feedback);
    }
} 