import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { TemplateModule } from '../template/template.module';
import { SelectorsModule } from '../selectors/selectors.module';
import { SelectorDialogsModule } from '../selectors-dialog/selectors-dialog.module';
import { ResponseComponent } from './responsedomain.component';
import { ResponseDetailComponent } from './responsedomain.detail.component';
import { ResponseFormComponent } from './responsedomain.form.component';
import { ResponseRoutingModule } from './responsedomain.route';
import { ResponsePreSelector } from './responsedomain.preselector.component';


@NgModule({
  imports: [ SharedModule, PreviewModule, TemplateModule, SelectorsModule, SelectorDialogsModule, ResponseRoutingModule ],

  declarations: [ResponsePreSelector, ResponseComponent, ResponseDetailComponent, ResponseFormComponent ],

  exports: [ResponseComponent ],

  providers: [  ]
})

export class ResponsedomainModule { }
