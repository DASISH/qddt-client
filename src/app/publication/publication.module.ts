import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { PublicationComponent } from './publication.component';
import { PublicationDetailComponent } from './publication.detail.component';
import { PublicationReuseComponent } from './publication.reuse.component';
import { PublicationSelectComponent } from './publication.select.component';
import { PublicationFormComponent } from './publication.form.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { ConceptModule } from '../home/concept/concept.module';
import { PublicationService } from './publication.service';

@NgModule({
  imports: [ SharedModule, PreviewModule, ResponsedomainModule, ConceptModule ],
  declarations: [ PublicationComponent, PublicationDetailComponent, PublicationReuseComponent,
    PublicationSelectComponent , PublicationFormComponent ],
  exports: [ PublicationComponent ],
  providers: [ PublicationService ]
})

export class PublicationModule { }
