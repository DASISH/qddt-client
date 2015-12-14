import {Component, Inject} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {SurveyService, SurveyProgram} from '../surveyprogram/surveyservice';
import {CommentListComponent} from '../comment/comment_list';
import {SurveyProgramEditComponent} from './edit/surveyprogram_edit';

@Component({
  selector: 'surveyprogram',
  templateUrl: './components/surveyprogram/surveyprogram.html',
  directives: [CommentListComponent, SurveyProgramEditComponent],
  pipes: [LocalDatePipe]
})
export class SurveyProgramComponent {

  showSurveyForm: boolean = false;
  model: SurveyProgram;
  surveyPrograms: Array<SurveyProgram> = [];

  constructor(@Inject(SurveyService) private surveyService: SurveyService) {
    this.surveyService = surveyService;
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

}
