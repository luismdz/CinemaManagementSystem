import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authSvc.user$.pipe(
      map((user: User) => {
        if (user.isLoggedIn) {
          Swal.fire({
            title: 'Sesión Activa',
            text:
              'Actualmente se encuentra con una sesión activa. Para proceder cierre su sesión',
            icon: 'error',
            timer: 5000,
          }).then(() => this.router.navigateByUrl('/'));

          return false;
        }

        return true;
      })
    );
  }
}
