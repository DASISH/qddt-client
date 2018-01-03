import { AuthGuard } from './auth-guard.service';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UserLoginComponent } from './user/user.component';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';


@NgModule({
  imports: [ ],
  declarations: [AuthGuard, LoginComponent, UserLoginComponent],
  providers: [AuthService, UserService],
  exports: [ AuthGuard, LoginComponent, UserLoginComponent ]
})

export class AuthModule { }
