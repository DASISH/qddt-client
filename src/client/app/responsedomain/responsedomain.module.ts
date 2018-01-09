import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../shared/preview/preview.module';
import { ResponsedomainComponent } from './responsedomain.component';
import { ResponsedomainFormComponent } from './responsedomain.form.component';
import { ResponsedomainListComponent } from './responsedomain.list.component';
import { ResponsedomainReuseComponent } from './responsedomain.reuse.component';
import { ResponsedomainSelectMissingComponent } from './responsedomain.select-missing.component';
import { ResponseDomainSearchComponent } from './responsedomain.search.component';
import { ResponseDomainSelectComponent } from './responsedomain.select.component';



@NgModule({
  imports: [ SharedModule, PreviewModule],
  declarations: [ResponsedomainComponent, ResponsedomainFormComponent, ResponsedomainListComponent,
     ResponsedomainReuseComponent, ResponseDomainSearchComponent, ResponseDomainSelectComponent,
    ResponsedomainSelectMissingComponent
    ],
  exports: [ResponsedomainComponent,
    ResponsedomainFormComponent, ResponsedomainListComponent,
    ResponsedomainReuseComponent, ResponsedomainSelectMissingComponent,
    ResponseDomainSearchComponent
    ]
})

export class ResponsedomainModule { }
