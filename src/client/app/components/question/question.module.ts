import { NgModule } from '@angular/core';
import { QuestionComponent } from './question.component';
import { QuestionDetailComponent } from './question.detail.component';
import { QuestionItemEditComponent } from './question.edit.component';
import { QuestionReuseComponent } from './question.reuse.component';
import { QuestionItemEditMissingComponent } from './question.edit.missing.component';
import { SharedModule } from '../../shared/shared.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { PreviewModule } from '../../common/preview/preview.module';

@NgModule({
  imports: [ SharedModule, ResponsedomainModule,PreviewModule],
  declarations: [QuestionComponent, QuestionDetailComponent,QuestionReuseComponent, QuestionItemEditComponent,
    QuestionItemEditMissingComponent],
  exports: [QuestionComponent, QuestionReuseComponent, QuestionItemEditComponent, QuestionDetailComponent ]
})

export class QuestionModule { }
