import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth-guard.service';
import { QddtPropertyStoreService } from './global/property.service';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { QddtMessageService } from './global/message.service';
import { TemplateModule } from '../template/template.module';
import { UserService } from './user/user.service';


@NgModule({
  imports: [ FormsModule, SharedModule, TemplateModule ],

  declarations: [ LoginComponent, ResetpasswordComponent ],

  exports: [ LoginComponent, ResetpasswordComponent ],

  providers: [ QddtPropertyStoreService, AuthGuard, QddtMessageService, UserService]
})

export class CoreModule {


}
