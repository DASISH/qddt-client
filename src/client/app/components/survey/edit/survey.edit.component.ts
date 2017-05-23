import { Component, Input, Output,EventEmitter } from '@angular/core';

import { SurveyService, SurveyProgram } from '../survey.service';

@Component({
  selector: 'qddt-survey-edit',
  moduleId: module.id,
  providers: [SurveyService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="survey" class="card" id="{{survey.id}}"  >
      <form materialize (ngSubmit)="onSave()" #surveyForm="ngForm">
        <div class="row">
          <div class="col s12">
            <label [attr.for]="survey.id + '-name'" class="active teal-text">Name</label>
            <input id="{{survey?.id}}-name"
              name="{{survey?.id}}-name"
              type="text" [(ngModel)]="survey.name" required>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <label [attr.for]="survey.id + '-description'" class="active teal-text">Description</label>
            <textarea id="{{survey?.id}}-description" name="{{survey?.id}}-description"
              class="materialize-textarea"  [(ngModel)]="survey.description" required></textarea>
          </div>
        </div>

        <div class="row">
		      <qddt-rational [element]="survey" [config]="{hidden: [2,3]}"></qddt-rational>
        </div>

        <div class="row">
          <qddt-revision-detail [element]="survey" [type]="'survey'"></qddt-revision-detail>
        </div>

        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>

  `
})
export class SurveyEditComponent {

  @Input() survey: SurveyProgram;
  @Input() isVisible: boolean;
  @Output() surveySavedEvent: EventEmitter<SurveyProgram> = new EventEmitter<SurveyProgram>();

  constructor(private surveyService: SurveyService) {
  }

  onSave() {
    this.isVisible = false;
    this.surveyService.save(this.survey)
      .subscribe((result: any) => {
        this.surveySavedEvent.emit(result);}
        ,(err: any) => console.log('ERROR: ', err));
  }

}
