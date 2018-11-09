import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/services/auth-guard.service';
import { TemplateListComponent } from '../template/template-list.component';
import { InstrumentComponent } from './instrument.component';
import { InstrumentDetailComponent } from './instrument.detail.component';


export const instrumentRoutes: Routes = [
  {
    path: '',
    component: InstrumentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'instruments', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'instruments/:id', component: InstrumentDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(instrumentRoutes) ],
  exports: [ RouterModule ]
})
export class InstrumentRoutingModule {}
