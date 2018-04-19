import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MissingComponent } from './missing.component';
import { MissingDetailComponent } from './missing.detail.component';
import { MissingFormComponent } from './missing.form.component';
import { MissingRoutingModule } from './missing.routes';
import { TemplateModule } from '../template/template.module';


@NgModule({
    imports: [ SharedModule, TemplateModule, MissingRoutingModule ],
    declarations: [ MissingComponent, MissingDetailComponent, MissingFormComponent ],
    exports: [ MissingComponent ],
    providers: [  ]
})

export class MissingModule { }
