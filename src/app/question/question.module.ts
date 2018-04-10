import { NgModule } from '@angular/core';
import { QuestionComponent } from './question.component';
import { QuestionDetailComponent } from './question.detail.component';
import { QuestionItemEditComponent } from './question.edit.component';
import { QuestionReuseComponent } from './question.reuse.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { QuestionService } from './question.service';
import { QuestionRoutingModule } from './question.route';
import { TemplateModule } from '../template/template.module';

@NgModule({
  imports: [ SharedModule, ResponsedomainModule, PreviewModule, TemplateModule, QuestionRoutingModule ],
  declarations: [QuestionComponent, QuestionDetailComponent, QuestionReuseComponent, QuestionItemEditComponent],
  exports: [QuestionComponent, QuestionReuseComponent, QuestionItemEditComponent, QuestionDetailComponent ],
  providers: [QuestionService]
})

export class QuestionModule { }
