import { NgModule } from '@angular/core';
import { QuestionComponent } from './question.component';
import { QuestionDetailComponent } from './question.detail.component';
import { QuestionFormComponent } from './question.form.component';
import { QuestionReuseComponent } from './question.reuse.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { QuestionRoutingModule } from './question.route';
import { TemplateModule } from '../template/template.module';
import { TemplateService } from '../template/template.service';

@NgModule({
  imports: [ SharedModule, ResponsedomainModule, PreviewModule, TemplateModule, QuestionRoutingModule ],
  declarations: [QuestionComponent, QuestionDetailComponent, QuestionReuseComponent, QuestionFormComponent],
  exports: [QuestionComponent, QuestionReuseComponent, QuestionFormComponent, QuestionDetailComponent ],
  providers: [TemplateService]
})

export class QuestionModule { }
