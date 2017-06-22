import { NgModule } from '@angular/core';
import { RevisionModule } from '../../common/revision/revision.module';
import { CompareModule } from '../../common/compare/compare.module';
import { CommentModule } from '../../common/comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { InstrumentComponent } from './instrument.component';
import { InstrumentDetailComponent } from './instrument.detail.component';

@NgModule({
  imports: [ SharedModule, RevisionModule, CompareModule, CommentModule],
  declarations: [InstrumentComponent, InstrumentDetailComponent],
  exports: [InstrumentComponent]
})

export class InstrumentModule { }
