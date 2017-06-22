import { NgModule } from '@angular/core';
import { RevisionModule } from '../../common/revision/revision.module';
import { CompareModule } from '../../common/compare/compare.module';
import { CommentModule } from '../../common/comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { PublicationComponent } from './publication.component';
import { PublicationDetailComponent } from './publication.detail.component';
import { PublicationReuseComponent } from './publication.reuse.component';
import { PublicationSelectComponent } from './publication.select.component';
import { PublicationPreviewComponent } from './publication.preview.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { ConceptModule } from '../concept/concept.module';
import { PreviewModule } from '../../common/preview/preview.module';

@NgModule({
  imports: [ SharedModule, RevisionModule, ResponsedomainModule, CompareModule, CommentModule, ConceptModule,PreviewModule],
  declarations: [ PublicationComponent, PublicationDetailComponent,PublicationReuseComponent,
    PublicationSelectComponent, PublicationPreviewComponent ],
  exports: [PublicationComponent]
})

export class PublicationModule { }
