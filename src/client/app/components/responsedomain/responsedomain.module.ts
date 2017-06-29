import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ResponsedomainComponent } from './responsedomain.component';
import { ResponsedomainFormComponent } from './responsedomain.form.component';
import { ResponsedomainListComponent } from './responsedomain.list.component';
import { ResponsedomainReuseComponent } from './responsedomain.reuse.component';
import { ResponseDomainSearchComponent } from './responsedomain.search.component';
import { ResponseDomainSelectComponent } from './responsedomain.select.component';
import { PreviewModule } from '../../common/preview/preview.module';
// import { ResponsedomainCodeListComponent } from '../../shared/preview/responsedomain/codelist.component';
// import { ResponsedomainDatetimeComponent } from '../../shared/preview/responsedomain/datetime.component';
// import { ResponsedomainMissingComponent } from '../../shared/preview/responsedomain/missing.component';
// import { ResponsedomainMixedComponent } from '../../shared/preview/responsedomain/mixed.component';
// import { ResponsedomainNumericComponent } from '../../shared/preview/responsedomain/numeric.component';
// import { ResponsedomainScaleComponent } from '../../shared/preview/responsedomain/scale.component';
// import { ResponsedomainTextComponent } from '../../shared/preview/responsedomain/text.component';
// import { DialogBoxComponent } from '../../shared/dialogbox/dialogbox.component';

@NgModule({
  imports: [ SharedModule, PreviewModule],
  declarations: [ResponsedomainComponent, ResponsedomainFormComponent, ResponsedomainListComponent,
     ResponsedomainReuseComponent,ResponseDomainSearchComponent,ResponseDomainSelectComponent
    // ,ResponsedomainCodeListComponent,ResponsedomainDatetimeComponent,ResponsedomainMissingComponent,
    // ResponsedomainMixedComponent,ResponsedomainNumericComponent,ResponsedomainScaleComponent,
    // ResponsedomainTextComponent
    ],
  exports: [ResponsedomainComponent,
    ResponsedomainFormComponent, ResponsedomainListComponent,
    ResponsedomainReuseComponent, ResponseDomainSearchComponent
    ]
})

export class ResponsedomainModule { }
