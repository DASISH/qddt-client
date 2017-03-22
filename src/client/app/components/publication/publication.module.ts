import { NgModule } from '@angular/core';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { PublicationComponent } from './publication.component';
import { PublicationDetailComponent } from './publication.detail.component';
import { PublicationReuseComponent } from './publication.reuse.component';
import { PublicationSelectComponent } from './publication.select.component';
import { PublicationPreviewComponent } from './publication.preview.component';
import { PublicationQuestionitemPreviewComponent } from './publication.questionitem.preview.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';

@NgModule({
  imports: [ SharedModule, RevisionModule, ResponsedomainModule, CompareModule, CommentModule],
  declarations: [ PublicationComponent, PublicationDetailComponent,
    PublicationReuseComponent, PublicationSelectComponent,
    PublicationPreviewComponent, PublicationQuestionitemPreviewComponent ],
  exports: [PublicationComponent]
})

export class PublicationModule { }
