import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | boolean {
    return this.authSvc.user$.pipe(
      map((user: User) => {
        const isLogged = user.isLoggedIn && user.isAdmin;
        if (!isLogged) {
          Swal.fire({
            title: 'Usuario no autorizado',
            text: 'No cuenta con los permisos para ingresar a esta opción.',
            icon: 'error',
            timer: 3000,
          }).then(() => this.router.navigateByUrl('auth/login'));
          return false;
        }

        return true;
      })
    );
  }
}
