import { NgModule } from '@angular/core';
import { ConceptComponent } from './concept.component';
import { ConceptEditComponent } from './concept-edit.component';
import { ConceptTocComponent } from './concept-toc.component';
import { TreeNodeComponent } from './concept-tree-node.component';
import { SharedModule } from '../../shared/shared.module';
import { QuestionModule } from '../../question/question.module';
import { ResponsedomainModule } from '../../responsedomain/responsedomain.module';
import { PreviewModule } from '../../preview/preview.module';
import { CopySourceModule } from '../copysource/copy-source.module';
import { ConceptService } from './concept.service';


@NgModule({
    imports: [ SharedModule, QuestionModule, ResponsedomainModule, PreviewModule, CopySourceModule],
    declarations: [ConceptComponent, ConceptEditComponent,
       ConceptTocComponent, TreeNodeComponent ],
    exports: [ConceptComponent,  TreeNodeComponent],
    providers: [ConceptService],
})

export class ConceptModule { }
