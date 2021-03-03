import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { authResponse } from '../../models/authResponse.model';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errores: string[] = [];
  showPassword = false;

  constructor(
    private authSvc: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
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

  validateLogin() {
    console.log(this.loginForm.value);
    const { email, password } = this.loginForm.value;

    this.authSvc.login({ email, password }).subscribe(
      (resp: authResponse) => {
        if (resp.result) {
          this.router.navigateByUrl('/');
        }
      },
      (err: authResponse) => {
        this.errores.push(...err.errors);

        this.loginForm.reset();

        console.log(this.loginForm);
      }
    );
  }
}
