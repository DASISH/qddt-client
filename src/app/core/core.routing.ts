import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AuthGuard } from './guard/auth-guard.service';


const routes: Routes = [
   { path: 'register', canActivate: [AuthGuard], component: RegisterComponent },
  { path: 'resetpass', canActivate: [AuthGuard], component: ResetpasswordComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRouting { }
