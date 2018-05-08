import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth-guard.service';
import { UserService } from './user/user.service';
import { QddtPropertyStoreService } from './global/property.service';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { QddtMessageService } from './global/message.service';
import { CoreRoutingModule } from './core.routing';
import { CoreComponent } from './core.component';
import { TemplateModule } from '../template/template.module';


@NgModule({
  imports: [ FormsModule, SharedModule, CoreRoutingModule, TemplateModule ],

  declarations: [ LoginComponent,
    ResetpasswordComponent, CoreComponent ],

  exports: [ CoreComponent ],

  providers: [ QddtPropertyStoreService, AuthGuard, UserService, QddtMessageService ]
})

export class CoreModule {


}
