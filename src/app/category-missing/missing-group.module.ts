import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule } from '../template/template.module';
import { MissingGroupRoutingModule } from './missing-group.routes';
import { MissingGroupComponent } from './missing-group.component';
import { MissingGroupDetailComponent } from './missing-group.detail.component';
import { MissingGroupFormComponent } from './missing-group.fom.component';
import { CategoryService } from './missing-group.service';


@NgModule({
    imports: [ SharedModule, TemplateModule, MissingGroupRoutingModule ],
    declarations: [ MissingGroupComponent, MissingGroupDetailComponent, MissingGroupFormComponent ],
    exports: [ MissingGroupComponent ],
    providers: [ CategoryService ]
})

export class MissingGroupModule { }
