import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginComponent} from '../login/login';
import {SurveyProgramComponent} from '../surveyprogram/surveyprogram';
import {CommitListComponent} from '../github/commit_list';
import {StudyComponent} from '../study/study';
import {TopicComponent} from '../topic/topic';


@Component({
  selector: 'search',
  templateUrl: './components/search/search.html',
  styleUrls: ['./components/search/search.css'],
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent,
    SurveyProgramComponent,
    CommitListComponent,
    StudyComponent,
    TopicComponent
  ]
})

export class SearchComp {

}
