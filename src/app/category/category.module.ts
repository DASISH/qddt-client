import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category.detail.component';
import { CategoryFormComponent } from './category.form.component';
import { CategoryRoutingModule } from './category.routes';
import { TemplateModule } from '../template/template.module';


@NgModule({
    imports: [ SharedModule, TemplateModule, CategoryRoutingModule ],
    declarations: [ CategoryComponent, CategoryDetailComponent, CategoryFormComponent ],
    exports: [ CategoryComponent ],
    providers: [  ]
})

export class CategoryModule { }
