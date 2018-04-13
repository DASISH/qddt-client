import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainComponent } from './responsedomain.component';
import { ResponsedomainFormComponent } from './responsedomain.form.component';
import { ResponsedomainReuseComponent } from './responsedomain.reuse.component';
import { ResponsedomainSelectMissingComponent } from './responsedomain.select-missing.component';
import { ResponseDomainService } from './responsedomain.service';
import { SelectorsModule } from '../selectors/selectors.module';


@NgModule({
  imports: [ SharedModule, PreviewModule, SelectorsModule],

  declarations: [ResponsedomainComponent, ResponsedomainFormComponent, ResponsedomainReuseComponent,
     ResponsedomainSelectMissingComponent ],

  exports: [ResponsedomainComponent, ResponsedomainReuseComponent, ResponsedomainSelectMissingComponent ],

  providers: [ ResponseDomainService ]
})

export class ResponsedomainModule { }
