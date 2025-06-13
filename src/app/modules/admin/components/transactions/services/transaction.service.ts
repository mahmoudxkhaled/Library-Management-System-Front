import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private apiService: ApiService) { }

  getAllTransactions(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/Transaction/GetAllTransactions');
  }

  getTransactionById(id: string): Observable<ApiResult> {
    return this.apiService.getByIdRequest<ApiResult>(`/Transaction/GetTransactionById`, id);
  }

  GetTransactionsByUserId(userId: string): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/Transaction/GetTransactionsByUserId/' + userId);
  }
  addTransaction(request: FormData): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>('/Transaction/AddTransaction', request);
  }

  updateTransaction(request: FormData): Observable<ApiResult> {
    return this.apiService.putRequest<ApiResult>('/Transaction/UpdateTransaction', request);
  }

  deleteTransaction(id: string): Observable<ApiResult> {
    return this.apiService.deleteRequest<ApiResult>(`/Transaction/DeleteTransaction`, id);
  }

  issueBook(request: FormData): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>(`/Transaction/IssueBook`, request);
  }

  returnBook(request: FormData): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>(`/Transaction/ReturnBook`, request);
  }
}