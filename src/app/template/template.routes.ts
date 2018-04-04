// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '../core/guard/auth-guard.service';
// import { TemplateComponent } from './template.component';
// import { TemplateListComponent } from './template-list.component';
// import { TemplateDetailComponent } from './template-detail.component';
//
//
// export const templateRoutes: Routes = [
//   {
//     path: '',
//     component: TemplateComponent,
//     canActivate: [AuthGuard],
//     children: [
//       { path: 'construct/questions', component: TemplateListComponent, canActivate: [AuthGuard], },
//       { path: 'construct/questions/:id', component: TemplateDetailComponent, canActivate: [AuthGuard], },
//       { path: 'construct/sequences', component: TemplateListComponent, canActivate: [AuthGuard], },
//       { path: 'construct/sequences/:id', component: TemplateDetailComponent, canActivate: [AuthGuard], },
//     ],
//   }
// ];
//
// @NgModule({
//   imports: [ RouterModule.forChild(templateRoutes) ],
//   exports: [ RouterModule ]
// })
// export class TemplateRoutingModule {}
