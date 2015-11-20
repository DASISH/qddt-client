import {Component, NgFor, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';

import {SurveyService, SurveyProgram} from '../surveyprogram/surveyservice';

@Component({
  selector: 'surveyprogram',
  templateUrl: './components/surveyprogram/surveyprogram.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, NgFor],
  providers: [SurveyService]
})
export class SurveyProgramComponent {

  model: SurveyProgram;
  surveyPrograms: Array<SurveyProgram> = [];

  private service: SurveyService;

  constructor(surveyService: SurveyService) {
    this.service = surveyService;
    this.model = new SurveyProgram();
    this.surveyPrograms = this.service.getModel();
  }

  save() {
    this.service.save(this.model);
    this.surveyPrograms = this.service.getModel();
  }

  refresh() {
    this.surveyPrograms = this.service.getModel();
  }
}