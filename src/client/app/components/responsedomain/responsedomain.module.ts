import { NgModule } from '@angular/core';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { ResponsedomainComponent } from './responsedomain.component';
import { ResponsedomainNumericComponent } from './responsedomain.numeric.component';
import { ResponsedomainScaleComponent } from './responsedomain.scale.component';
import { ResponsedomainTextComponent } from './responsedomain.text.component';
import { ResponsedomainDatetimeComponent } from './responsedomain.datetime.component';
import { ResponsedomainCodeListComponent } from './responsedomain.codelist.component';
import { ResponsedomainMissingComponent } from './responsedomain.missing.component';
import { ResponsedomainMixedComponent } from './responsedomain.mixed.component';
import { ResponsedomainFormComponent } from './responsedomain.form.component';
import { ResponsedomainListComponent } from './responsedomain.list.component';
import { PreviewComponent } from './responsedomain.preview.component';
import { ResponsedomainReuseComponent } from './responsedomain.reuse.component';
import { ResponseDomainSearchComponent } from './responsedomain.search.component';
import { ResponseDomainSelectComponent } from './responsedomain.select.component';

@NgModule({
  imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ],
  declarations: [ResponsedomainComponent, ResponsedomainNumericComponent,
    ResponsedomainScaleComponent, ResponsedomainTextComponent,
    ResponsedomainDatetimeComponent, ResponsedomainCodeListComponent,
    ResponsedomainMissingComponent,
    ResponsedomainFormComponent, ResponsedomainListComponent,
    PreviewComponent, ResponsedomainReuseComponent,
    ResponseDomainSearchComponent, ResponsedomainMixedComponent,
    ResponseDomainSelectComponent
    ],
  exports: [ResponsedomainComponent,
    ResponsedomainFormComponent, ResponsedomainListComponent,
    PreviewComponent, ResponsedomainReuseComponent,
    ResponseDomainSearchComponent
    ]
})

export class ResponsedomainModule { }
