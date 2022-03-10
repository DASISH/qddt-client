import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { MissingComponent } from './missing.component';
import { MissingDetailComponent } from './missing.detail.component';
import { MissingFormComponent } from './missing.form.component';
import { MissingRoutingModule } from './missing.routes';
import { SelectorsModule } from '../selectors/selectors.module';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  imports: [ComponentsModule, MissingRoutingModule, SelectorsModule, DragDropModule],
  declarations: [MissingComponent, MissingDetailComponent, MissingFormComponent],
  exports: [MissingComponent],
  providers: []
})

export class MissingModule { }
