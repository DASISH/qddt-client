import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { PublicationComponent } from './publication.component';
import { PublicationDetailComponent } from './publication.detail.component';
import { PublicationReuseComponent } from './publication.reuse.component';
import { PublicationFormComponent } from './publication.form.component';
import { PublicationPreselectorComponent } from './publication.preselector.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { PublicationService } from './publication.service';
import { PublicationRoutingModule } from './publication.routes';
import { TemplateModule } from '../template/template.module';
import { SelectorsModule } from '../selectors/selectors.module';

@NgModule({
  imports: [ SharedModule, PreviewModule, ResponsedomainModule, PublicationRoutingModule, TemplateModule, SelectorsModule],
  declarations: [ PublicationComponent, PublicationDetailComponent, PublicationReuseComponent, PublicationPreselectorComponent,
    PublicationFormComponent ],
  exports: [ PublicationComponent ],
  providers: [ PublicationService ]
})

export class PublicationModule { }
