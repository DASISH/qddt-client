import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category.detail.component';
import { CategoryEditComponent } from './category.edit.component';
import { CategorySchemeComponent } from './category.scheme.component';
import { CategoryService } from './category.service';


// import { RevisionModule } from '../../common/revision/revision.module';
// import { CommentModule } from '../../shared/comment/comment.module';
// import { MenuComponent } from '../menu/menu.component';

@NgModule({
    imports: [ SharedModule ],
    declarations: [ CategoryComponent, CategoryDetailComponent,
      CategoryEditComponent, CategorySchemeComponent ],
    exports: [ CategoryComponent, CategorySchemeComponent ],
    providers: [ CategoryService ]
})

export class CategoryModule { }
