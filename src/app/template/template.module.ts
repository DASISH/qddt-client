import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TemplateComponent } from './template.component';
import { TemplateListComponent } from './template-list.component';
import { TemplateDetailComponent } from './template-detail.component';
import { TemplateService } from './template.service';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ TemplateComponent, TemplateListComponent, TemplateDetailComponent ],
  providers: [ TemplateService ],
  exports: [ TemplateComponent, TemplateListComponent, TemplateDetailComponent ]
})

export class TemplateModule { }
