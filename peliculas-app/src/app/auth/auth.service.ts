import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './models/user.model';
import { authResponse } from './models/AuthResponse.model';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURL + '/auth';
  private user: User;
  private localStorageItemName = 'userToken';

  user$: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.user = { email: null, isSignedIn: false };

    this.getUserTokenFromLocalStorage();
  }

  login(): Observable<authResponse> {
    const obj = {
      email: 'prueba@test.com',
      password: '0QNqMz.',
    };

    return this.http.post(this.apiUrl + '/login', obj).pipe(
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

        return of(authResp);
      })
      // tap(console.log)
    );
  }

  private getUserFromToken(token: string): User {
    const dataFromToken = JSON.parse(atob(token.split('.')[1]));

    this.user = {
      name: dataFromToken.name,
      email: dataFromToken.email,
      isSignedIn: true,
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
      isSignedIn: false,
    };

    if (localStorage.getItem(this.localStorageItemName) !== null) {
      const { token, expirationTime } = JSON.parse(
        localStorage.getItem(this.localStorageItemName)
      );

      if (new Date(expirationTime) < new Date()) {
        localStorage.removeItem(this.localStorageItemName);

        this.user$.next(this.user);
      } else {
        this.user = this.getUserFromToken(token);
      }
    } else {
      this.user$.next(this.user);
    }
  }
}
