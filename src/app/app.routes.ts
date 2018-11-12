import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetpasswordComponent } from './modules/core/resetpassword/resetpassword.component';
import { LoginComponent } from './modules/core/login/login.component';
import { UserOptionComponent } from './modules/core/useroption/useroption.component';
import { PageNotFoundComponent } from './modules/core/pagenotfound/page-not-found.component';
import { AuthGuard } from './modules/core/services';



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
