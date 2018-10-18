import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { QddtPropertyStoreService } from './services/property.service';
import { QddtMessageService } from './services/message.service';
import { AuthGuard } from './services/auth-guard.service';
import { TemplateModule } from '../template/template.module';

import { UserService } from './services/user.service';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';


@NgModule({
  imports: [ FormsModule, SharedModule, TemplateModule ],

  declarations: [ LoginComponent, ResetpasswordComponent ],

  exports: [ LoginComponent, ResetpasswordComponent ],

  providers: [ QddtPropertyStoreService, AuthGuard, QddtMessageService, UserService]
})

export class CoreModule {


}
