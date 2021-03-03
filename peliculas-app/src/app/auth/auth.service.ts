import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './models/user.model';
import { authResponse } from './models/authResponse.model';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURL + '/auth';
  private user: User;
  private localStorageItemName = 'userToken';

  user$: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.user = { email: null, isLoggedIn: false };

    this.getUserTokenFromLocalStorage();
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
