import {Component, Input} from 'angular2/core';

import {SurveyService, SurveyProgram} from '../../surveyprogram/surveyservice';

@Component({
  selector: 'surveyprogram-edit',
  providers: [SurveyService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="surveyProgram" class="card" id="{{surveyProgram.id}}"  >
        <form (ngSubmit)="save()" #hf="ngForm">
          <div class="row">
            <div class="input-field col">
              <input id="name" type="text" [(ngModel)]="surveyProgram.name" required>
              <label for="name" class="white-text">Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s10">
              <textarea id="description" class="materialize-textarea" [(ngModel)]="surveyProgram.description" required></textarea>
              <label for="description" class="white-text">Description</label>
            </div>
          </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
    </div>
  </div>

  `
})
export class SurveyProgramEditComponent {

  @Input() surveyProgram: SurveyProgram;
  private service: SurveyService;

  constructor(surveyService: SurveyService) {
    this.service = surveyService;
  }

  save() {
    this.service.save(this.surveyProgram);
  }

}
