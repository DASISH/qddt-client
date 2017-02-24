import { NgModule } from '@angular/core';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { PublicationComponent } from './publication.component';
import { PublicationDetailComponent } from './publication.detail.component';

@NgModule({
  imports: [ SharedModule, RevisionModule, CompareModule, CommentModule],
  declarations: [PublicationComponent, PublicationDetailComponent],
  exports: [PublicationComponent]
})

export class PublicationModule { }
