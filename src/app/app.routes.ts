import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, ResetpasswordComponent, UserOptionComponent } from './modules/core';
import { PageNotFoundComponent } from './components/pagenotfound/page-not-found.component';
import { AuthGuard } from './lib';
import { SearchComponent } from './modules/search/search.component';



const appRoutes: Routes = [
  { path: 'home', redirectTo: '/survey', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword', outlet: 'popup', component: ResetpasswordComponent, canActivate: [AuthGuard], },
  { path: 'useroption', outlet: 'popup', component: UserOptionComponent, canActivate: [AuthGuard], },
  // { path: 'search/:id', outlet: 'popup', component: SearchComponent, canActivate: [AuthGuard], },
  { path: '**', component: PageNotFoundComponent }
];

// export const routing: ModuleWithProviders =
//   RouterModule.forRoot(appRoutes, {
//     enableTracing: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', scrollOffset: [0, 64]
//   });
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    enableTracing: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', scrollOffset: [0, 64],
    relativeLinkResolution: 'corrected'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
