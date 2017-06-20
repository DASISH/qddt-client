import { NgModule } from '@angular/core';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { PreviewResponsedomainComponent } from './responsedomain.preview.component';
import { ResponsedomainComponent } from './responsedomain.component';
import { ResponsedomainFormComponent } from './responsedomain.form.component';
import { ResponsedomainListComponent } from './responsedomain.list.component';
import { ResponsedomainReuseComponent } from './responsedomain.reuse.component';
import { ResponseDomainSearchComponent } from './responsedomain.search.component';
import { ResponseDomainSelectComponent } from './responsedomain.select.component';
import { ResponsedomainCodeListComponent } from './preview/responsedomain.codelist.component';
import { ResponsedomainDatetimeComponent } from './preview/responsedomain.datetime.component';
import { ResponsedomainMissingComponent } from './preview/responsedomain.missing.component';
import { ResponsedomainMixedComponent } from './preview/responsedomain.mixed.component';
import { ResponsedomainNumericComponent } from './preview/responsedomain.numeric.component';
import { ResponsedomainScaleComponent } from './preview/responsedomain.scale.component';
import { ResponsedomainTextComponent } from './preview/responsedomain.text.component';

@NgModule({
  imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ],
  declarations: [ResponsedomainComponent, ResponsedomainFormComponent, ResponsedomainListComponent,
     ResponsedomainReuseComponent,ResponseDomainSearchComponent,ResponseDomainSelectComponent,
    ResponsedomainCodeListComponent,ResponsedomainDatetimeComponent,ResponsedomainMissingComponent,
    ResponsedomainMixedComponent,ResponsedomainNumericComponent,ResponsedomainScaleComponent,
    ResponsedomainTextComponent,PreviewResponsedomainComponent
    ],
  exports: [ResponsedomainComponent, PreviewResponsedomainComponent,
    ResponsedomainFormComponent, ResponsedomainListComponent,
    ResponsedomainReuseComponent, ResponseDomainSearchComponent
    ]
})

export class ResponsedomainModule { }
