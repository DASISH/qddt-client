import { NgModule } from '@angular/core';
// import { RevisionModule } from '../../common/revision/revision.module';
// import { CommentModule } from '../../shared/comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { InstrumentComponent } from './instrument.component';
import { InstrumentDetailComponent } from './instrument.detail.component';

@NgModule({
  imports: [ SharedModule],
  declarations: [InstrumentComponent, InstrumentDetailComponent],
  exports: [InstrumentComponent]
})

export class InstrumentModule { }
