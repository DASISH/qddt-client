import { NgModule } from '@angular/core';
import { ConceptComponent } from './concept.component';
import { ConceptEditComponent } from './edit/concept.edit.component';
import { ConceptTocComponent } from './concept.toc.component';
import { TreeNodeComponent } from './concept.tree.node.component';
 // import { PreviewConceptComponent } from '../previews/concept.preview.component';

import { SharedModule } from '../../shared/shared.module';
import { QuestionModule } from '../question/question.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { CommentModule } from '../comment/comment.module';
import { RevisionModule } from '../revision/revision.module';
import { PreviewModule } from '../preview/preview.module';

@NgModule({
    imports: [ SharedModule, QuestionModule, ResponsedomainModule, RevisionModule, CommentModule ,PreviewModule],
    declarations: [ConceptComponent, ConceptEditComponent,
       ConceptTocComponent, TreeNodeComponent ],
    exports: [ConceptComponent,  TreeNodeComponent]
})

export class ConceptModule { }
