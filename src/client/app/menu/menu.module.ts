import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from '../home/home.routes';
import { MenuComponent } from './menu.component';
import { GravatarModule } from 'ng2-gravatar-directive/src/gravatar.module';

@NgModule({
  imports: [ SharedModule, HomeRoutingModule,GravatarModule],
  declarations: [MenuComponent],
  providers: [],
  exports: [MenuComponent]
})

export class MenuModule { }
