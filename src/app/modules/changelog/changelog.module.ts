import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ChangeLogComponent } from './changelog.component';
import { ChangeLogDetailComponent } from './changelog.detail.component';
import { ChangeLogFormComponent } from './changelog.form.component';
import { ChangeLogRoutingModule } from './changelog.routes';


@NgModule({
    imports: [ ComponentsModule, ChangeLogRoutingModule ],
    declarations: [ ChangeLogComponent, ChangeLogDetailComponent, ChangeLogFormComponent ],
    exports: [ ChangeLogComponent ],
    providers: [  ]
})

export class ChangeLogModule { }
