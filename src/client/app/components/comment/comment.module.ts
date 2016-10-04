import { NgModule } from '@angular/core';
import { CommentListComponent } from './comment_list.component';
import { NewCommentComponent }   from './new_comment.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [SharedModule],
    declarations: [CommentListComponent, NewCommentComponent],
    exports: [CommentListComponent]
})

export class CommentModule { }
