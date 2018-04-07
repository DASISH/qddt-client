import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainComponent } from './responsedomain.component';
import { ResponsedomainFormComponent } from './responsedomain.form.component';
import { ResponsedomainReuseComponent } from './responsedomain.reuse.component';
import { ResponsedomainSelectMissingComponent } from './responsedomain.select-missing.component';
import { ResponseDomainSelectComponent } from './responsedomain.select.component';
import { ResponseDomainService } from './responsedomain.service';



@NgModule({
  imports: [ SharedModule, PreviewModule],

  declarations: [ResponsedomainComponent, ResponsedomainFormComponent, ResponsedomainReuseComponent,
    ResponseDomainSelectComponent, ResponsedomainSelectMissingComponent ],

  exports: [ResponsedomainComponent, ResponsedomainReuseComponent, ResponseDomainSelectComponent, ResponsedomainSelectMissingComponent ],

  providers: [ ResponseDomainService ]
})

export class ResponsedomainModule { }
