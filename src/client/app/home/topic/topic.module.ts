import { NgModule } from '@angular/core';
import { TopicComponent } from './topic.component';
import { SharedModule } from '../../shared/shared.module';
import { TopicEditComponent } from './topic.edit.component';
import { QuestionModule } from '../../question/question.module';
import { PreviewModule } from '../../shared/preview/preview.module';



@NgModule({
    imports: [ SharedModule, QuestionModule, PreviewModule],
    declarations: [TopicComponent, TopicEditComponent],
    exports: [TopicComponent]
})

export class TopicModule { }
