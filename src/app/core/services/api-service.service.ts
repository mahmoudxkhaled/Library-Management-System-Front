import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Options } from '@fullcalendar/core/preact';
import { Observable } from 'rxjs';
import { SelectedFilter } from 'src/app/modules/admin/models/SelectedFilters';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    BASE_URL = environment.apiUrl;
    BASE_URLII = environment.apiUrlWithoutAPI;

    constructor(private httpClient: HttpClient) { }
    ExportToExcel(path:string,SelectedFilters:SelectedFilter[]):Observable<ArrayBuffer>
    {
      return  this.httpClient.post(`${this.BASE_URL}${path}`,SelectedFilters,{responseType:'arraybuffer'});
    }
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