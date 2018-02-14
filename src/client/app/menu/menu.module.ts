import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from '../home/home.routes';
import { MenuComponent } from './menu.component';
// import { GravatarDirective } from 'ng2-gravatar-directive/src/gravatar.directive';

@NgModule({
  imports: [ SharedModule, HomeRoutingModule ],
  declarations: [ MenuComponent ],
  providers: [],
  exports: [MenuComponent]
})

export class MenuModule { }
