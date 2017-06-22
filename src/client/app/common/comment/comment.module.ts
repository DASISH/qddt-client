import { NgModule } from '@angular/core';
import { CommentListComponent } from './comment.list.component';
import { CommentCreateComponent }   from './comment.create.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [SharedModule],
    declarations: [CommentListComponent, CommentCreateComponent],
    exports: [CommentListComponent]
})

export class CommentModule { }
