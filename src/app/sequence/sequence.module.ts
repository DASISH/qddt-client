import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { SequenceComponent } from './sequence.component';
import { SequenceDetailComponent } from './sequence.detail.component';
import { SequenceReuseComponent } from './sequence.reuse.component';
import { ConditionEditComponent } from './condition.edit.component';
import { StatementEditComponent } from './statement.edit.component';
import { SequenceEditComponent } from './sequence.edit.component';
import { SequenceService } from './sequence.service';
import { SequenceContentComponent } from './sequence.content.component';


@NgModule({
  imports: [ SharedModule,  PreviewModule],

  declarations: [ SequenceComponent, SequenceDetailComponent, SequenceContentComponent, SequenceReuseComponent,
                   SequenceEditComponent, ConditionEditComponent, StatementEditComponent ],

  exports: [ SequenceComponent ],

  providers: [SequenceService]
})

export class SequenceModule { }
