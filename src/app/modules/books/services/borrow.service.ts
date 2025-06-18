import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api-service.service';
import { ApiResult } from 'src/app/core/models/ApiResult';

export interface BorrowBookDto {
    bookId: number;
    dueDate: Date;
}

@Injectable({
    providedIn: 'root'
})
export class BorrowService {
    constructor(private apiService: ApiService) { }

    BorrowBook(feedback: BorrowBookDto): Observable<ApiResult> {
        return this.apiService.postRequest<ApiResult>('/Transaction/BorrowBook', feedback);
    }
} 