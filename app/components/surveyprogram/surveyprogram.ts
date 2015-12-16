import {Component, Inject, EventEmitter, Output} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {LocalDatePipe} from '../../common/date_pipe';
import {SurveyProgramDetails} from './details/surveyprogram_details';

import {SurveyService, SurveyProgram} from './surveyservice';
import {CommentListComponent} from '../comment/comment_list';
import {SurveyProgramEditComponent} from './edit/surveyprogram_edit';

@Component({
  selector: 'surveyprogram',
  templateUrl: './components/surveyprogram/surveyprogram.html',
  directives: [CommentListComponent, SurveyProgramEditComponent],
  pipes: [LocalDatePipe],
  providers: [SurveyService]
})
@RouteConfig([
  { path: '/survey/:id', component: SurveyProgramDetails, as: 'Survey'},
])
export class SurveyProgramComponent {

  showSurveyForm: boolean = false;
  model: SurveyProgram;
  surveyPrograms: Array<SurveyProgram> = [];
  @Output() surveyCreateEvent: EventEmitter<String> = new EventEmitter();

  constructor(private surveyService: SurveyService) {
    this.model = new SurveyProgram();
    this.surveyPrograms = this.surveyService.getModel();
  }

  save() {
    this.showSurveyForm = false;
    this.surveyService.save(this.model);
    this.surveyPrograms = this.surveyService.getModel();
    this.model = new SurveyProgram();
  }

  toggleSurveyForm() {
    this.showSurveyForm = !this.showSurveyForm;
  }

  create(surveyProgram: any) {
    this.surveyCreateEvent.emit(surveyProgram);
  }

}
