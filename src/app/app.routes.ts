import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './core/pagenotfound/page-not-found.component';
import { LoginComponent } from './core/login/login.component';
import { ResetpasswordComponent } from './core/resetpassword/resetpassword.component';
import { UserOptionComponent } from './core/useroption/useroption.component';
import { AuthGuard } from './core/services/auth-guard.service';


const appRoutes: Routes = [
  { path: 'home', redirectTo: '/survey', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword', outlet: 'popup', component: ResetpasswordComponent, canActivate: [AuthGuard], },
  { path: 'useroption', outlet: 'popup', component: UserOptionComponent, canActivate: [AuthGuard], },
  { path: '**', component: PageNotFoundComponent }
];

export const routing: ModuleWithProviders =
  RouterModule.forRoot(appRoutes, {
    enableTracing: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', scrollOffset: [0, 100] } );
