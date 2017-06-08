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
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { ConceptModule } from '../concept/concept.module';
import { PreviewModule } from '../preview/preview.module';

@NgModule({
  imports: [ SharedModule, RevisionModule, ResponsedomainModule, CompareModule, CommentModule, ConceptModule,PreviewModule],
  declarations: [ PublicationComponent, PublicationDetailComponent,PublicationReuseComponent,
    PublicationSelectComponent, PublicationPreviewComponent ],
  exports: [PublicationComponent]
})

export class PublicationModule { }
