import {Component, CORE_DIRECTIVES, FORM_DIRECTIVES, Input} from 'angular2/angular2';

import {SurveyService, SurveyProgram} from '../../surveyprogram/surveyservice';

@Component({
  selector: 'surveyprogram-edit',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
  providers: [SurveyService],
  template: `
    <div *ng-if="surveyProgram" class="card">
      {{surveyProgram}}
      <form (ng-submit)="save()">
      <div class="form-group">
        <label for="surveyProgram.name">Name</label>

        <input type="text" class="form-control" required
               [(ng-model)]="surveyProgram.name">
      </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
    </div>

  `
})
export class SurveyProgramEditComponent {

  private service: SurveyService;
  @Input() surveyProgram: SurveyProgram;

  constructor(surveyService: SurveyService) {
    this.service = surveyService;
  }

  save() {
    this.service.save(this.surveyProgram);
  }

}
