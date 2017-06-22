import { NgModule } from '@angular/core';
import { StudyComponent }   from '../study/study.component';
import { StudyEditComponent }   from '../study/edit/study.edit.component';
import { RevisionModule } from '../../common/revision/revision.module';
import { CompareModule } from '../../common/compare/compare.module';
import { CommentModule } from '../../common/comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
// import { PreviewModule } from '../preview/preview.module';


@NgModule({
    imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ],
    declarations: [StudyComponent, StudyEditComponent],
    exports: [StudyComponent]
})

export class StudyModule { }
