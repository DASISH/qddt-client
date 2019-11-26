import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SequenceDetailComponent} from './sequence-construct.detail.component';
import {SequenceConstructComponent} from './sequence-construct.component';
import {AuthGuard} from '../../lib/services';
import {TemplateListComponent} from '../../components/template';


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
