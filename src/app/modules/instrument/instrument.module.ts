import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { InstrumentComponent } from './instrument.component';
import { InstrumentRoutingModule } from './instrument.routes';
import { InstrumentFormComponent } from './instrument.form.component';
import { InstrumentDetailComponent } from './instrument.detail.component';
import { PreviewModule } from '../preview/preview.module';
import { SelectorsModule } from '../selectors/selectors.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelectorDialogsModule } from '../selectors-dialog/selectors-dialog.module';

@NgModule({
  imports: [ComponentsModule, InstrumentRoutingModule, PreviewModule, SelectorsModule,
    SelectorDialogsModule, DragDropModule],
  declarations: [InstrumentComponent, InstrumentFormComponent, InstrumentDetailComponent],
  exports: [InstrumentComponent],
  providers: []
})

export class InstrumentModule { }
