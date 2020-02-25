import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { PublicationComponent } from './publication.component';
import { PublicationDetailComponent } from './publication.detail.component';
import { PublicationReuseComponent } from './publication.reuse.component';
import { PublicationFormComponent } from './publication.form.component';
import { PublicationPreselectorComponent } from './publication.preselector.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { PublicationService } from '../../lib/services';
import { PublicationRoutingModule } from './publication.routes';
import { SelectorsModule } from '../selectors/selectors.module';
import {SelectorDialogsModule} from '../selectors-dialog/selectors-dialog.module';

@NgModule({
  imports: [ ComponentsModule, PreviewModule, ResponsedomainModule, PublicationRoutingModule, SelectorsModule, SelectorDialogsModule],
  declarations: [ PublicationComponent, PublicationDetailComponent, PublicationReuseComponent, PublicationPreselectorComponent,
    PublicationFormComponent ],
  exports: [ PublicationComponent ],
  providers: [ PublicationService ]
})

export class PublicationModule { }
