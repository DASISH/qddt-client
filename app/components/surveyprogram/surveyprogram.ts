import {Component, NgFor, CORE_DIRECTIVES, FORM_DIRECTIVES, Inject} from 'angular2/angular2';
import {HTTP_PROVIDERS, Http} from 'angular2/http';

import {Tabs} from '../../common/tabs/tabs';
import {SurveyService, SurveyProgram} from '../surveyprogram/surveyservice';

@Component({
  selector: 'surveyprogram-form',
  templateUrl: './components/surveyprogram/surveyprogram.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, NgFor, Tabs],
  viewProviders: [HTTP_PROVIDERS],
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
    this.surveyPrograms = this.service.getAll();
  }
}
