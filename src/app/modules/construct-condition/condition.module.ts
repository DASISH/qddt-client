import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ConditionComponent } from './condition.component';
import { ConditionDetailComponent } from './condition.detail.component';
import { ConditionFormComponent } from './condition.form.component';
import { ConditionRoutingModule } from './condition.routes';


@NgModule({
    imports: [ ComponentsModule, ConditionRoutingModule ],
    declarations: [ ConditionComponent, ConditionDetailComponent, ConditionFormComponent ],
    exports: [ ConditionComponent ],
    providers: [  ]
})

export class ConditionModule { }
