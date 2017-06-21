import { NgModule } from '@angular/core';
import { TopicComponent }   from '../topic/topic.component';
import { RevisionModule } from '../../common/revision/revision.module';
import { CompareModule } from '../../common/compare/compare.module';
import { CommentModule } from '../../common/comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { TopicEditComponent }   from './edit/topic.edit.component';
import { QuestionModule } from '../question/question.module';
import { PreviewModule } from '../../common/preview/preview.module';

@NgModule({
    imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ,QuestionModule,PreviewModule],
    declarations: [TopicComponent, TopicEditComponent],
    exports: [TopicComponent, TopicEditComponent]
})

export class TopicModule { }
