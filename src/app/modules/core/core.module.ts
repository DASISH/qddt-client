import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';


import { AuthGuard, MessageService, PropertyStoreService, UserService} from './services';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { UserOptionComponent} from './useroption/useroption.component';


@NgModule({
  imports: [ FormsModule, ComponentsModule ],

  declarations: [ LoginComponent, ResetpasswordComponent, UserOptionComponent],

  exports: [ LoginComponent, ResetpasswordComponent, UserOptionComponent ],

  providers: [ PropertyStoreService, AuthGuard, MessageService, UserService]
})

export class CoreModule {


}
