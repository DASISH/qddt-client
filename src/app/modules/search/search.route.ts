import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../lib/services';
import { SearchComponent } from './search.component';


// export const searchRoutes: Routes = [
//   {
//     path: '',
//     component: SearchComponent,
//     canActivate: [AuthGuard],
//     children: [
//       { path: 'previews', component: SearchComponent, canActivate: [AuthGuard], },
//       { path: 'previews/:id', component: SearchComponent, canActivate: [AuthGuard], },
//       { path: 'previews/:id', component: SearchComponent, canActivate: [AuthGuard], },
//     ],
//   }
// ];
export const searchRoutes: Routes = [
  { path: 'preview', component: SearchComponent, canActivate: [AuthGuard], },
  { path: 'preview/:id', component: SearchComponent, canActivate: [AuthGuard], },
  { path: 'preview/:id/:revision', component: SearchComponent, canActivate: [AuthGuard], },
];

@NgModule({
  imports: [RouterModule.forChild(searchRoutes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }

// { path: ':id', component: SearchComponent, canActivate: [AuthGuard], },

// { path: 'preview/:id/:revision', component: SearchComponent, canActivate: [AuthGuard], },
// { path: '/:id', component: SearchComponent, canActivate: [AuthGuard], },
// { path: 'search/:id/:revision', component: SearchComponent, canActivate: [AuthGuard], },

