import {  ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth-guard.service';
import { UserService } from './user/user.service';
import { PropertyStoreService } from './global/property.service';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { QddtMessageService } from './global/message.service';
import { CoreRoutingModule } from './core.routing';
import { CoreComponent } from './core.component';


@NgModule({
  imports: [ FormsModule, SharedModule, CoreRoutingModule ],

  declarations: [ LoginComponent, RegisterComponent, ResetpasswordComponent, CoreComponent ],

  exports: [ CoreComponent ],

  providers: [ PropertyStoreService, AuthGuard, UserService, QddtMessageService ]
})

export class CoreModule {

  // static forRoot(config: PropertyStoreService): ModuleWithProviders {
  //   return {
  //     ngModule: CoreModule,
  //     providers: [
  //       { provide: PropertyStoreService, useValue: config }
  //     ]
  //   };
  // }
  //
  // constructor(@Optional() @SkipSelf() parentModule: UserService) {
  //   if (parentModule) {
  //     throw new Error(
  //       'CoreModule is already loaded. Import it in the AppModule only');
  //   }
  // }

}
