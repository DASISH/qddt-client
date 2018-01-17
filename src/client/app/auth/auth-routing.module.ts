import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AuthGuard } from './auth-guard.service';


const routes: Routes = [
  { path: 'register', canActivate:[AuthGuard], component: RegisterComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'forgotpass', canActivate:[AuthGuard], component: ForgotpasswordComponent },
  { path: 'resetpass', canActivate:[AuthGuard], component: ResetpasswordComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
