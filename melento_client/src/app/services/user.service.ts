import { Injectable } from '@angular/core';
import { User } from '../models/user';
// import { Address } from '../models/address';
import { Observable, catchError, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { LocalStorageService } from './local-storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  arrUser: User[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      
    }),
  };
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this, (this.arrUser = []);
  }

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(`${this.baseUrl}/user`, this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  getUserss(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(`${this.baseUrl}/fUsers`, this.httpHeader)
      .pipe(catchError(this.handleError));
  }



  getUserById(id: string): Observable<User> {
    return this.httpClient
      .get<User>(`${this.baseUrl}/user/${id}`)
      .pipe(catchError(this.handleError));
  }

  register(user: User): Observable<User> {
    return this.httpClient
      .post<User>(`${this.baseUrl}/register`, JSON.stringify(user),this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  
  addUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(`${this.baseUrl}/user`, JSON.stringify(user), this.httpHeader)
      .pipe(catchError(this.handleError));
  }
  updateUser(user: User): Observable<User> {
    return this.httpClient
      .put<User>(`${this.baseUrl}/user`, JSON.stringify(user), this.httpHeader)
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrl}/login`, { email, password }, this.httpHeader)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('role');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof HttpErrorResponse) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
