import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { authResponse } from '../../models/authResponse.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errores: string[] = [];
  showPassword = false;
  isLoading = false;

  constructor(
    private authSvc: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZA-ZÀ-ÿ.\u00f1\u00d1 ´]*$'),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          new RegExp(/[a-z0-9._%+-]+\@[a-z0-9.-]+\.[a-z]{2,3}$/, 'i')
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  get nombre() {
    return this.registerForm.get('nombre');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  ngOnInit(): void {}

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }

    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  registerUser() {
    const { nombre: name, email, password } = this.registerForm.value;
    this.isLoading = true;

    this.authSvc.register({ name, email, password }).subscribe(
      (resp: authResponse) => {
        if (resp.result) {
          this.router.navigateByUrl('/');
        }
        this.isLoading = false;
      },
      (err: authResponse) => {
        if (Array.isArray(err.errors)) {
          this.errores.push(...err.errors);
        } else {
          this.errores.push(
            ...['Error inesperado, intente más tarde.', err.errors]
          );
        }
        this.registerForm.reset();
        this.isLoading = false;
      }
    );
  }
}
