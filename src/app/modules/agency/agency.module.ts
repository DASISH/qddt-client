import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { AgencyComponent } from './agency.component';
import { AgencyDetailComponent } from './agency.detail.component';
import { AgencyFormComponent } from './agency.form.component';
import { AgencyRoutingModule } from './agency.routes';


@NgModule({
  imports: [ComponentsModule, AgencyRoutingModule],
  declarations: [AgencyComponent, AgencyDetailComponent, AgencyFormComponent],
  exports: [AgencyComponent],
  providers: []
})

export class AgencyModule { }
