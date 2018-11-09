import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateListComponent } from '../template/template-list.component';
import { SequenceDetailComponent } from './sequence-construct.detail.component';
import { SequenceConstructComponent } from './sequence-construct.component';
import { AuthGuard } from '../core/services/auth-guard.service';


export const sequenceRoutes: Routes = [
  {
    path: '',
    component: SequenceConstructComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'sequences', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'sequences/:id', component: SequenceDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(sequenceRoutes) ],
  exports: [ RouterModule ]
})
export class SequenceRoutingModule {}
