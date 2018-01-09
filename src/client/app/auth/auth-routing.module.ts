import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AuthlessPageGuard } from './../middlewares/authless-page.guard';


const routes: Routes = [
  { path: 'register', canActivate:[AuthlessPageGuard], component: RegisterComponent },
  { path: 'login', canActivate:[AuthlessPageGuard], component: LoginComponent },
  { path: 'forgotpass', canActivate:[AuthlessPageGuard], component: ForgotpasswordComponent },
  { path: 'resetpass', canActivate:[AuthlessPageGuard], component: ResetpasswordComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
