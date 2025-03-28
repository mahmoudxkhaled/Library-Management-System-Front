import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event.hasOwnProperty('body') && event['body']) {
          event = this.attachDomainToUploads(event);
        }
        return event;
      })
    );
  }
  private attachDomainToUploads(event: HttpEvent<any>): HttpEvent<any> {
    const baseUrl = environment.apiUrlWithoutAPI;
    if (typeof event['body'] === 'object') {
      const jsonString = JSON.stringify(event['body']);
      if (jsonString.includes('Uploads/')) {
        const modifiedJson = jsonString.replace(/"Uploads\//g, `"${baseUrl}/Uploads/`);
        event = Object.assign(event, { body: JSON.parse(modifiedJson) });
      }
    }
    return event;
  }
}
