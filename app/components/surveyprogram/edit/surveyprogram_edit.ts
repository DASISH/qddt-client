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
            <div class="input-field">
              <input type="text" [(ngModel)]="surveyProgram.name" required>
              <label for="name" class="active teal-text">Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field">
              <textarea class="materialize-textarea" [(ngModel)]="surveyProgram.description" required></textarea>
              <label for="description" class="active teal-text">Description</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field">
              <input type="text" [(ngModel)]="surveyProgram.changeComment" required>
              <label for="changeComment" class="active teal-text">ChangeComment</label>
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
