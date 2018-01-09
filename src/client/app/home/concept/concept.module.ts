import { NgModule } from '@angular/core';
import { ConceptComponent } from './concept.component';
import { ConceptEditComponent } from './concept-edit.component';
import { ConceptTocComponent } from './concept-toc.component';
import { TreeNodeComponent } from './concept-tree-node.component';
import { SharedModule } from '../../shared/shared.module';
import { QuestionModule } from '../../question/question.module';
import { ResponsedomainModule } from '../../responsedomain/responsedomain.module';
import { PreviewModule } from '../../shared/preview/preview.module';



@NgModule({
    imports: [ SharedModule, QuestionModule, ResponsedomainModule, PreviewModule ],
    declarations: [ConceptComponent, ConceptEditComponent,
       ConceptTocComponent, TreeNodeComponent ],
    exports: [ConceptComponent,  TreeNodeComponent]
})

export class ConceptModule { }
