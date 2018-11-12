import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstrumentDetailComponent} from './instrument.detail.component';
import { InstrumentComponent} from './instrument.component';
import { AuthGuard} from '../core/services';
import { TemplateListComponent} from '../../components/template';


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
