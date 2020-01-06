import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { UniverseComponent } from './universe.component';
import { UniverseDetailComponent } from './universe.detail.component';
import { UniverseFormComponent } from './universe.form.component';
import { UniverseRoutingModule } from './universe.routes';


@NgModule({
    imports: [ ComponentsModule, UniverseRoutingModule ],
    declarations: [ UniverseComponent, UniverseDetailComponent, UniverseFormComponent ],
    exports: [ UniverseComponent ],
    providers: [  ]
})

export class UniverseModule { }
