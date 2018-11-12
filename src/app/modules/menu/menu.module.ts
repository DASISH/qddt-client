import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { MenuComponent } from './menu.component';
import { HomeRoutingModule} from '../home/home.routes';

@NgModule({
  imports: [ ComponentsModule, HomeRoutingModule ],
  declarations: [ MenuComponent ],
  providers: [],
  exports: [MenuComponent]
})

export class MenuModule { }
