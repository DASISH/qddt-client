import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AuthGuard } from './guard/auth-guard.service';
import { CoreComponent } from './core.component';
import { LoginComponent } from './login/login.component';


export const CORE_ROUTES: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full'},
      { path: 'login', component: LoginComponent },
      { path: 'resetpassword', component: ResetpasswordComponent , canActivate: [AuthGuard] }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(CORE_ROUTES) ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }


