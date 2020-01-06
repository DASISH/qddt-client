import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ConditionComponent } from './condition.component';
import { ConditionDetailComponent } from './condition.detail.component';
import { ConditionFormComponent } from './condition.form.component';
import { ConditionRoutingModule } from './condition.routes';
import { IfThenElseFormComponent} from './condition-ifthenelse.form.component';
import { ForIFormComponent } from './condition-fori.form.component';
import { ForeachFormComponent } from './condition-foreach.form.component';


@NgModule({
    imports: [ ComponentsModule, ConditionRoutingModule ],
    declarations: [ ConditionComponent, ConditionDetailComponent, ConditionFormComponent,
      IfThenElseFormComponent, ForIFormComponent, ForeachFormComponent],
    exports: [ ConditionComponent ],
    providers: [  ]
})

export class ConditionModule { }
