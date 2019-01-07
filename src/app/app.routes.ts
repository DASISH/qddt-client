import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/core/services';
import { LoginComponent, ResetpasswordComponent, UserOptionComponent } from './modules/core';
import { PageNotFoundComponent } from './modules/core/pagenotfound/page-not-found.component';



const appRoutes: Routes = [
  { path: 'home', redirectTo: '/survey', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword', outlet: 'popup', component: ResetpasswordComponent, canActivate: [AuthGuard], },
  { path: 'useroption', outlet: 'popup', component: UserOptionComponent, canActivate: [AuthGuard], },
  { path: '**', component: PageNotFoundComponent }
];

export const routing: ModuleWithProviders =
  RouterModule.forRoot(appRoutes, {
    enableTracing: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', scrollOffset: [0, 300] } );
