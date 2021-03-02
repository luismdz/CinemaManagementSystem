import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [AuthRoutingModule],
})
export class AuthModule {}
