import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UniverseComponent } from './universe.component';
import { UniverseDetailComponent } from './universe.detail.component';
import { UniverseFormComponent } from './universe.form.component';
import { UniverseRoutingModule } from './universe.routes';
import { TemplateModule } from '../template/template.module';


@NgModule({
    imports: [ SharedModule, TemplateModule, UniverseRoutingModule ],
    declarations: [ UniverseComponent, UniverseDetailComponent, UniverseFormComponent ],
    exports: [ UniverseComponent ],
    providers: [  ]
})

export class UniverseModule { }
