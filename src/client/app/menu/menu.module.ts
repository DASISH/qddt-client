import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from '../home/home.routes';
import { AuthService } from '../auth/auth.service';
import { MenuComponent } from './menu.component';
import { GravatarModule } from 'ng2-gravatar-directive/src/gravatar.module';

@NgModule({
  imports: [ SharedModule, HomeRoutingModule,GravatarModule],
  declarations: [MenuComponent],
  providers: [AuthService],
  exports: [MenuComponent]
})

export class MenuModule { }
