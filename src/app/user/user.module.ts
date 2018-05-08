import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user.component';
import { UserDetailComponent } from './user.detail.component';
import { UserFormComponent } from './user.form.component';
import { UserRoutingModule } from './user.routes';
import { TemplateModule } from '../template/template.module';


@NgModule({
    imports: [ SharedModule, TemplateModule, UserRoutingModule ],
    declarations: [ UserComponent, UserDetailComponent, UserFormComponent ],
    exports: [ UserComponent ],
    providers: [  ]
})

export class UserModule { }
