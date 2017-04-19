import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/shared.module';
import { UserLoginComponent } from '../../common/user.component';

@NgModule({
    imports: [ SharedModule ],
    declarations: [ LoginComponent, UserLoginComponent ],
    exports: [ UserLoginComponent ]
})

export class LoginModule { }
