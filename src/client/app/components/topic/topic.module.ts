import { NgModule } from '@angular/core';
import { TopicComponent }   from '../topic/topic.component';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { TopicEditComponent }   from './edit/topic_edit.component';

@NgModule({
    imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ],
    declarations: [TopicComponent, TopicEditComponent],
    exports: [TopicComponent, TopicEditComponent]
})

export class TopicModule { }
