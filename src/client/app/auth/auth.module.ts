import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UserLoginComponent } from './user/user.component';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [SharedModule ],
  declarations: [LoginComponent, UserLoginComponent],
  providers: [AuthGuard,AuthService],
  exports: [LoginComponent, UserLoginComponent ]
})

export class AuthModule { }
