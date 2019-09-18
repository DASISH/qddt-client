import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { HomeRoutingModule } from './home.routes';
import { HomeComponent } from './home.component';
import { CopySourceComponent } from './copysource/copy-source.component';
import { SurveyComponent } from './survey/survey.component';
import { StudyComponent } from './study/study.component';
import { TopicComponent } from './topic/topic.component';
import { ConceptComponent } from './concept/concept.component';
import { SurveyEditComponent } from './survey/survey.edit.component';
import { StudyEditComponent } from './study/study.edit.component';
import { TopicEditComponent } from './topic/topic.edit.component';
import { TreeNodeComponent } from './concept/concept-tree-node.component';
import { ConceptEditComponent } from './concept/concept-edit.component';
import { HomeService } from '../../lib/services/home.service';
import { ConceptTocComponent } from './concept/concept-toc.component';
import { PreviewModule } from '../preview/preview.module';
import { QuestionModule } from '../question/question.module';
import { SelectorsModule } from '../selectors/selectors.module';
import { SelectorDialogsModule } from '../selectors-dialog/selectors-dialog.module';

@NgModule({
  imports: [ ComponentsModule, HomeRoutingModule, PreviewModule, QuestionModule, SelectorDialogsModule, SelectorsModule ],

  declarations: [ HomeComponent, SurveyComponent, SurveyEditComponent,
    StudyComponent, StudyEditComponent, TopicComponent, TopicEditComponent,
    ConceptComponent, TreeNodeComponent, ConceptEditComponent, ConceptTocComponent,
    CopySourceComponent ],

  providers: [HomeService ],

  exports: [ HomeComponent ]
})

export class HomeModule {

// } implements OnInit {

  // constructor(private route: ActivatedRoute) { }

  // ngOnInit() {
  //   this.route.fragment.subscribe(fragment => {
  //     document.querySelector('#' + fragment).scrollIntoView();
  //   });
  // }
}

