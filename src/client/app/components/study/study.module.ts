import { NgModule } from '@angular/core';
import { StudyComponent }   from '../study/study.component';
import { StudyCreateComponent }   from '../study/create.component';
import { StudyEditComponent }   from '../study/edit/study_edit.component';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ],
    declarations: [StudyComponent, StudyCreateComponent, StudyEditComponent],
    exports: [StudyComponent]
})

export class StudyModule { }
