import { NgModule } from '@angular/core';
import { ConceptComponent } from './concept.component';
import { ConceptEditComponent } from './edit/concept.edit.component';
import { ConceptQuestionComponent } from './concept.question.component';
import { ConceptTocComponent } from './concept.toc.component';
import { TreeNodeComponent } from './concept.tree.node.component';
 // import { PreviewConceptComponent } from '../previews/concept.preview.component';

import { SharedModule } from '../../shared/shared.module';
import { QuestionModule } from '../question/question.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { CommentModule } from '../comment/comment.module';
import { RevisionModule } from '../revision/revision.module';

@NgModule({
    imports: [ SharedModule, QuestionModule, ResponsedomainModule, RevisionModule, CommentModule ],
    declarations: [ConceptComponent, ConceptEditComponent,
      ConceptQuestionComponent, ConceptTocComponent, TreeNodeComponent ],
    exports: [ConceptComponent, ConceptQuestionComponent, TreeNodeComponent]
})

export class ConceptModule { }
