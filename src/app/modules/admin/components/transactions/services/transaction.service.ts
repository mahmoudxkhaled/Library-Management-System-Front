import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ApiService } from 'src/app/core/services/api-service.service';
import { SelectedFilter } from '../../../models/SelectedFilters';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private apiService: ApiService) { }

  getAllTransactions(): Observable<ApiResult> {
    return this.apiService.getAllRequest<ApiResult>('/Transaction/GetAllTransactions');
  }
 ExportToExcel(SelectedFilters:SelectedFilter[]): Observable<ArrayBuffer>
  {
    return this.apiService.ExportToExcel(`/Transaction/ExportToExcel`,SelectedFilters);
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
  sendReturnReminder(transactionId:string): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>(`/Transaction/send-issued-book-reminder/${transactionId}`, {});
  }
  sendOverdueNotifications(): Observable<ApiResult> {
    return this.apiService.postRequest<ApiResult>(`/Transaction/SendOverdueNotifications`, {});
  }
}