import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/shared.module';
import { UserLogin } from '../../common/user.component';

@NgModule({
    imports: [ SharedModule ],
    declarations: [ LoginComponent, UserLogin ],
    exports: [ UserLogin, LoginComponent ]
})

export class LoginModule { }
