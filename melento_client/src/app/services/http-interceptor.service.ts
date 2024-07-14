import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage-service.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  token = " ";
  constructor(private localStorageService: LocalStorageService) {
    this.token = this.localStorageService.getItem('token')!;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = this.localStorageService.getItem('token');

    console.log('token is the ', this.token);
    if (this.token && !request.url.includes('/register')) {
      request = request.clone({ 
        setHeaders: {
          authorization: `Bearer ${this.token}`
        }
      });
    }
    return next.handle(request);
  }
}