import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../../preview/preview.module';
import { SelectorsModule } from '../../selectors/selectors.module';
import { SelectorDialogsModule } from '../../selectors-dialog/selectors-dialog.module';
import { ResponseComponent } from './responsedomain.component';
import { ResponseDetailComponent } from './responsedomain.detail.component';
import { ResponseFormComponent } from './responsedomain.form.component';
import { ResponseRoutingModule } from './responsedomain.route';
import { ResponsePreSelector } from './responsedomain.preselector.component';


@NgModule({
  imports: [ ComponentsModule, PreviewModule, SelectorsModule, SelectorDialogsModule, ResponseRoutingModule ],

  declarations: [ResponsePreSelector, ResponseComponent, ResponseDetailComponent, ResponseFormComponent ],

  exports: [ResponseComponent ],

  providers: [  ]
})

export class ResponsedomainModule { }
