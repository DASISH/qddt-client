import {Component, NgFor, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';

import {LocalDatePipe} from '../../common/date_pipe';

import {SurveyService, SurveyProgram} from '../surveyprogram/surveyservice';
import {CommentListComponent} from '../comment/comment_list';
import {SurveyProgram} from './create/create';
import {SurveyProgramEditComponent} from './edit/surveyprogram_edit'

@Component({
  selector: 'surveyprogram',
  templateUrl: './components/surveyprogram/surveyprogram.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, NgFor, CommentListComponent, SurveyProgramEditComponent],
  providers: [SurveyService],
  pipes: [LocalDatePipe]
})
export class SurveyProgramComponent {

  showSurveyForm: boolean = false;
  showEdit: boolean = false;
  model: SurveyProgram;
  surveyPrograms: Array<SurveyProgram> = [];
  private service: SurveyService;

  constructor(surveyService: SurveyService) {
    this.service = surveyService;
    this.model = new SurveyProgram();
    this.surveyPrograms = this.service.getModel();
  }

  save() {
    this.showSurveyForm = false;
    this.service.save(this.model);
    this.surveyPrograms = this.service.getModel();
    this.model = new SurveyProgram();
  }

  toggleSurveyForm() {
   this.showSurveyForm = !this.showSurveyForm;
  }

  toggleEdit() {
    this.showEdit = !this.showEdit;
  }

}
