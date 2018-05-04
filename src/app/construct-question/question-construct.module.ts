import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';


import { SelectorsModule } from '../selectors/selectors.module';
import { TemplateModule } from '../template/template.module';
import { QuestionConstructComponent } from './question-construct.component';
import { QuestionConstructDetailComponent } from './question-construct.detail.component';
import { QuestionConstructFormComponent } from './question-construct.form.component';
import { QuestionConstructRoutingModule } from './question-construct.routes';



@NgModule({
  imports: [ SharedModule, ResponsedomainModule, QuestionModule, PreviewModule, SelectorsModule,
    TemplateModule, QuestionConstructRoutingModule ],
  declarations: [ QuestionConstructComponent, QuestionConstructDetailComponent, QuestionConstructFormComponent ],
  exports: [ QuestionConstructComponent ],
  providers: [  ]
})

export class QuestionConstructModule { }
