import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PublicationComponent } from './publication.component';
import { PublicationDetailComponent } from './publication.detail.component';
import { PublicationReuseComponent } from './publication.reuse.component';
import { PublicationSelectComponent } from './publication.select.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { ConceptModule } from '../concept/concept.module';
import { PreviewModule } from '../../common/preview/preview.module';
import { PublicationFormComponent } from './publication.form.component';

@NgModule({
  imports: [ SharedModule, ResponsedomainModule, ConceptModule,PreviewModule],
  declarations: [ PublicationComponent, PublicationDetailComponent,PublicationReuseComponent,
    PublicationSelectComponent ,PublicationFormComponent],
  exports: [PublicationComponent]
})

export class PublicationModule { }
