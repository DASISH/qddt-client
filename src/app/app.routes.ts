import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AuthGuard } from './core/guard/auth-guard.service';
import { PageNotFoundComponent } from './core/pagenotfound/page-not-found.component';


const appRoutes: Routes = [
  { path: 'home', redirectTo: '/survey', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
];

export const routing: ModuleWithProviders =
  RouterModule.forRoot(appRoutes, {
    enableTracing: false, anchorScrolling: 'enabled', scrollOffset: [0, 100] } );
