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
            <div class="input-field col s12">
              <input type="text" [(ngModel)]="surveyProgram.name" required>
              <label for="name" class="active teal-text">Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <textarea class="materialize-textarea"  [(ngModel)]="surveyProgram.description" required></textarea>
              <label for="description" class="active teal-text">Description</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s4">
              <input type="text" [(ngModel)]="surveyProgram.changeReason" >
              <input type="text" [(ngModel)]="surveyProgram.changeComment" required>
              <label for="changeComment" class="active teal-text">Save Comment</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
                <p><label class="active teal-text">Authors</label></p>
                
                <div id="author1" class="chip">Admin <i class="material-icons">close</i></div>
                <div id="author2" class="chip">Stig Norland <i class="material-icons">close</i></div>
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
