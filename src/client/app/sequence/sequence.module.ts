import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../shared/preview/preview.module';
import { SequenceComponent } from './sequence.component';
import { SequenceDetailComponent } from './sequence.detail.component';
import { SequenceReuseComponent } from './sequence.reuse.component';
import { SequenceContentComponent } from './sequence.content.component';
import { ConditionEditComponent } from './condition.edit.component';
import { StatementEditComponent } from './statement.edit.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';


@NgModule({
  imports: [ SharedModule, ResponsedomainModule , PreviewModule],
  declarations: [ SequenceComponent, SequenceDetailComponent, SequenceReuseComponent,
    SequenceContentComponent, ConditionEditComponent, StatementEditComponent ],
  exports: [ SequenceComponent ]
})

export class SequenceModule { }
