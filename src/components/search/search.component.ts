import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginComponent} from '../login/login.component';
import {SurveyProgramComponent} from '../surveyprogram/surveyprogram.component';

@Component({
  selector: 'search',
  moduleId: module.id,
  templateUrl: './search.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent,
    SurveyProgramComponent
  ]
})
export class SearchComp {

}
