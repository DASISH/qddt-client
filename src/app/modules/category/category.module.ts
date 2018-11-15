import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category.detail.component';
import { CategoryFormComponent } from './category.form.component';
import { CategoryRoutingModule } from './category.routes';


@NgModule({
    imports: [ ComponentsModule, CategoryRoutingModule ],
    declarations: [ CategoryComponent, CategoryDetailComponent, CategoryFormComponent ],
    exports: [ CategoryComponent ],
    providers: [  ]
})

export class CategoryModule { }
