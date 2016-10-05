import { NgModule } from '@angular/core';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category.detail.component';
import { CategoryEditComponent } from './edit/category_edit.component';

import { CategorySchemeComponent } from './category.scheme.component';
import { SharedModule } from '../../shared/shared.module';

import { RevisionModule } from '../revision/revision.module';
import { CommentModule } from '../comment/comment.module';
@NgModule({
    imports: [ SharedModule, RevisionModule, CommentModule ],
    declarations: [ CategoryComponent, CategoryDetailComponent,
    CategoryEditComponent, CategorySchemeComponent],
    exports: [ CategoryComponent, CategorySchemeComponent ]
})

export class CategoryModule { }
