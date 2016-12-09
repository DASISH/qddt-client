import { NgModule } from '@angular/core';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { SequenceComponent } from './sequence.component';
import { SequenceDetailComponent } from './sequence.detail.component';
import { SequenceReuseComponent } from './sequence.reuse.component';

@NgModule({
  imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ],
  declarations: [ SequenceComponent, SequenceDetailComponent, SequenceReuseComponent ],
  exports: [ SequenceComponent ]
})

export class SequenceModule { }
