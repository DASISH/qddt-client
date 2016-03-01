import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginComponent} from '../login/login';
import {SurveyProgramComponent} from '../surveyprogram/surveyprogram';
import {CommitListComponent} from '../github/commit_list';
import {StudyComponent} from '../study/study';


@Component({
  selector: 'responsedomain',
  templateUrl: './components/responsedomain/responsedomain.html',
  styleUrls: ['./components/responsedomain/responsedomain.css'],
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent,
    SurveyProgramComponent,
    CommitListComponent,
    StudyComponent
  ]
})

export class ResponsedomainComp {

}
