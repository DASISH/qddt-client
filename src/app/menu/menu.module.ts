import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from '../home/home.routes';
import { MenuComponent } from './menu.component';

@NgModule({
  imports: [ SharedModule, HomeRoutingModule ],
  declarations: [ MenuComponent ],
  providers: [],
  exports: [MenuComponent]
})

export class MenuModule { }
