import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { StatementComponent } from './statement.component';
import { StatementDetailComponent } from './statement.detail.component';
import { StatementFormComponent } from './statement.form.component';
import { StatementRoutingModule } from './statement.routes';


@NgModule({
    imports: [ ComponentsModule, StatementRoutingModule ],
    declarations: [ StatementComponent, StatementDetailComponent, StatementFormComponent ],
    exports: [ StatementComponent ],
    providers: [  ]
})

export class StatementModule { }
