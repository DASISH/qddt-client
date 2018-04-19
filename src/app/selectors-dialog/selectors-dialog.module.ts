import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { SelectorsModule } from '../selectors/selectors.module';
import { ResponsedomainReuseComponent } from './responsdomain/responsedomain.reuse.component';
import { ResponsedomainSelectMissingComponent } from './missing/responsedomain.select-missing.component';
import { QuestionReuseComponent } from './question/question.reuse.component';


@NgModule({
  imports: [ SharedModule, PreviewModule, SelectorsModule],
  declarations: [ ResponsedomainReuseComponent, ResponsedomainSelectMissingComponent, QuestionReuseComponent ],
  exports: [ ResponsedomainReuseComponent, ResponsedomainSelectMissingComponent, QuestionReuseComponent ],
  providers: [  ]
})

export class SelectorDialogsModule { }
