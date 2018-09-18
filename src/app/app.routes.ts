import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AuthGuard } from './core/guard/auth-guard.service';
import { PageNotFoundComponent } from './core/pagenotfound/page-not-found.component';
import { LoginComponent } from './core/login/login.component';
import { ResetpasswordComponent } from './core/resetpassword/resetpassword.component';


const appRoutes: Routes = [
  { path: 'home', redirectTo: '/survey', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  // { path: 'loginpopup', component: LoginComponent, outlet: 'popup' },
  { path: '**', component: PageNotFoundComponent }
];

export const routing: ModuleWithProviders =
  RouterModule.forRoot(appRoutes, {
    enableTracing: false, anchorScrolling: 'enabled', scrollOffset: [0, 100] } );
