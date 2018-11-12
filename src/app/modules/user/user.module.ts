import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { UserComponent } from './user.component';
import { UserDetailComponent } from './user.detail.component';
import { UserFormComponent } from './user.form.component';
import { UserRoutingModule } from './user.routes';


@NgModule({
    imports: [ ComponentsModule, UserRoutingModule ],
    declarations: [ UserComponent, UserDetailComponent, UserFormComponent ],
    exports: [ UserComponent ],
    providers: [  ]
})

export class UserModule { }
