import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PreviewModule } from '../../preview/preview.module';
import { CopySourceModule } from '../copysource/copy-source.module';
import { TopicComponent } from './topic.component';
import { TopicEditComponent } from './topic.edit.component';
import { QuestionModule } from '../../question/question.module';
import { TopicService } from './topic.service';


@NgModule({
    imports: [ SharedModule, QuestionModule, PreviewModule, CopySourceModule ],
    declarations: [TopicComponent, TopicEditComponent],
    exports: [TopicComponent],
    providers: [TopicService]
})

export class TopicModule { }
