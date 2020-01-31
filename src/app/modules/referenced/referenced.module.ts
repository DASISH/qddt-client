import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ReferencedComponent } from './referenced.component';
import { ReferencedDetailComponent } from './referenced.detail.component';
import { ReferencedFormComponent } from './referenced.form.component';
import { ReferencedRoutingModule } from './referenced.routes';


@NgModule({
  imports: [ComponentsModule, ReferencedRoutingModule],
  declarations: [ReferencedComponent, ReferencedDetailComponent, ReferencedFormComponent],
  exports: [ReferencedComponent],
  providers: []
})

export class ReferencedModule { }
