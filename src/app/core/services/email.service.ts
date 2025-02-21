import { Injectable } from '@angular/core';
import { ISendEmailRequest } from '../models/ISendEmailRequest';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResult } from '../models/ApiResult';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiService } from './api-service.service';

const API_USERS_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})


export class EmailService {
  isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient, private dataService: ApiService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
  }


  sendForm(emailRequest: ISendEmailRequest): Observable<ApiResult> {
    this.isLoadingSubject.next(true);
    const httpHeaders = new HttpHeaders({
      tenant: environment.defaultTenantId,
    });
    return this.httpClient.post<ApiResult>(`${API_USERS_URL}/AppUser/SendEmail`, emailRequest, { headers: httpHeaders, });
  }


}
