import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [SharedModule ],
  declarations: [LoginComponent],
  providers: [AuthGuard,AuthService],
  exports: [LoginComponent ]
})

export class AuthModule { }
