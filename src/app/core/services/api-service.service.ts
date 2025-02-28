import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    BASE_URL = environment.apiUrl;
    BASE_URLII = environment.apiUrlWithoutAPI;

    constructor(private httpClient: HttpClient) { }

    getAllRequest<T>(path: string): Observable<T> {
        return this.httpClient.get<T>(`${this.BASE_URL}${path}`);
    }

    getByIdRequest<T>(path: string, identifier: any): Observable<T> {
        return this.httpClient.get<T>(`${this.BASE_URL}${path}/${identifier}`);
    }

    getByTwoIdsRequest<T>(path: string, identifier1: any, identifier2: any): Observable<T> {
        return this.httpClient.get<T>(`${this.BASE_URL}${path}/${identifier1}/${identifier2}`);
    }

    postRequest<T>(path: string, data: any): Observable<T> {
        return this.httpClient.post<T>(`${this.BASE_URL}${path}`, data);
    }

    putRequest<T>(path: string, data: any): Observable<T> {
        return this.httpClient.put<T>(`${this.BASE_URL}${path}`, data);
    }

    putByIdRequest<T>(path: string, identifier: any,): Observable<T> {
        return this.httpClient.put<T>(`${this.BASE_URL}${path}/${identifier}`, null);
    }

    deleteRequest<T>(path: string, identifier: any): Observable<T> {
        return this.httpClient.delete<T>(`${this.BASE_URL}${path}/${identifier}`);
    }
}