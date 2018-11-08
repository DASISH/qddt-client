import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChangeLogComponent } from './changelog.component';
import { ChangeLogDetailComponent } from './changelog.detail.component';
import { ChangeLogFormComponent } from './changelog.form.component';
import { ChangeLogRoutingModule } from './changelog.routes';
import { TemplateModule } from '../template/template.module';


@NgModule({
    imports: [ SharedModule, TemplateModule, ChangeLogRoutingModule ],
    declarations: [ ChangeLogComponent, ChangeLogDetailComponent, ChangeLogFormComponent ],
    exports: [ ChangeLogComponent ],
    providers: [  ]
})

export class ChangeLogModule { }
