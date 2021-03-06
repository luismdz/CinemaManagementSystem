import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { User } from './models/user.model';
import { authResponse } from './models/authResponse.model';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiURL + '/auth';
  private readonly localStorageItemName = 'userToken';
  private user: User;

  user$: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.getUserTokenFromLocalStorage();
  }

  obtenerUsuariosPorPagina(
    pageNumber: number = 1,
    pageSize: number = 50
  ): Observable<User[]> {
    pageNumber = pageNumber < 1 ? 1 : pageNumber;
    pageSize = pageSize < 5 ? 5 : pageSize;

    return this.http
      .get<any>(
        `${this.apiUrl}/users?pageNumber=${pageNumber}&pageSize=${pageSize}`
      )
      .pipe(
        map((resp: any) => {
          const users = resp.data.map((x: User) => {
            return <User>{
              ...x,
              isAdmin: x.isAdmin ? true : false,
            };
          });

          return {
            ...resp,
            data: users,
          };
        })
      );
  }

  hacerAdmin(email: string) {
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.http.post<any>(
      `${this.apiUrl}/addAdmin`,
      JSON.stringify(email),
      { headers: headers }
    );
  }

  removerAdmin(email: string) {
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.http.post<any>(
      `${this.apiUrl}/removeAdmin`,
      JSON.stringify(email),
      { headers: headers }
    );
  }

  login(user: User): Observable<authResponse> {
    return this.http.post(this.apiUrl + '/login', user).pipe(
      map((resp: any) => {
        this.saveUserTokenToLocalStorage(resp);

        return <authResponse>{
          user: this.getUserFromToken(resp.token),
          expirationTime: resp.expirationTime,
          result: true,
        };
      }),
      catchError((err: HttpErrorResponse) => {
        const authResp: authResponse = {
          errors: err.error?.errors,
          result: false,
        };

        return throwError(authResp);
      })
    );
  }

  register(user: User): Observable<authResponse> {
    return this.http.post(this.apiUrl + '/register', user).pipe(
      map((resp: any) => {
        this.saveUserTokenToLocalStorage(resp);

        return <authResponse>{
          user: this.getUserFromToken(resp.token),
          expirationTime: resp.expirationTime,
          result: true,
        };
      }),
      catchError((err: HttpErrorResponse) => {
        const authResp: authResponse = {
          errors: err.error?.errors,
          result: false,
        };

        return throwError(authResp);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.localStorageItemName);
    this.user$.next({ isLoggedIn: false, email: null });
  }

  getToken() {
    let token = null;

    if (localStorage.getItem(this.localStorageItemName)) {
      token = JSON.parse(localStorage.getItem(this.localStorageItemName))[
        'token'
      ];
    }

    return token;
  }

  private getUserFromToken(token: string): User {
    const dataFromToken = JSON.parse(atob(token.split('.')[1]));

    this.user = {
      name: dataFromToken.name,
      email: dataFromToken.email,
      isAdmin: dataFromToken.role === 'admin' ? true : false,
      isLoggedIn: true,
    };

    this.user$.next(this.user);

    return this.user;
  }

  private saveUserTokenToLocalStorage({ result, token, expirationTime }) {
    if (result) {
      const userToken = {
        token,
        expirationTime,
      };

      localStorage.setItem(
        this.localStorageItemName,
        JSON.stringify(userToken)
      );
    }
  }

  private getUserTokenFromLocalStorage() {
    this.user = {
      email: null,
      isLoggedIn: false,
    };

    if (localStorage.getItem(this.localStorageItemName) !== null) {
      const { token, expirationTime } = JSON.parse(
        localStorage.getItem(this.localStorageItemName)
      );

      if (new Date(expirationTime) < new Date()) {
        this.logout();
      } else {
        this.user = this.getUserFromToken(token);
      }
    }

    this.user$.next(this.user);
  }
}
