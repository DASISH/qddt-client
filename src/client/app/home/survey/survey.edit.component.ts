import { Component, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { SurveyService, SurveyProgram } from './survey.service';

declare var Materialize: any;

@Component({
  selector: 'qddt-survey-edit',
  moduleId: module.id,
  providers: [SurveyService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="survey" id="{{survey.id}}"  >
      <form materialize (ngSubmit)="onSave()" #surveyForm="ngForm">
        <div class="row">
          <div class="col s12 input-field">
            <label [attr.for]="survey.id + '-name'" class="teal-text">Name</label>
            <input id="{{survey?.id}}-name"
              name="{{survey?.id}}-name"
              type="text" [(ngModel)]="survey.name" required>
          </div>
        </div>
        <div class="row">
          <div class="col s12" input-field>
            <label [attr.for]="survey.id + '-description'" class=" teal-text">Description</label>
            <textarea id="{{survey?.id}}-description" name="{{survey?.id}}-description"
              class="materialize-textarea"  [(ngModel)]="survey.description" required autosize></textarea>
          </div>
        </div>
        <qddt-rational [formName]="'RationalComp'" [element]="survey" [config]="{hidden: [2,3]}"></qddt-rational>
        <qddt-element-footer [element]="survey" [type]="'survey'"></qddt-element-footer>
        <div class="row right-align">
          <button type="submit" class="btn btn-default" [disabled]="!surveyForm.form.valid" >Submit</button>
        </div>
      </form>
    </div>
  </div>

  `
})

export class SurveyEditComponent implements AfterContentChecked {

  @Input() survey: SurveyProgram;
  @Input() isVisible: boolean;
  @Output() surveySavedEvent: EventEmitter<SurveyProgram> = new EventEmitter<SurveyProgram>();


  constructor(private surveyService: SurveyService) {
  }

  ngAfterContentChecked(): void {
    Materialize.updateTextFields();
  }


  onSave() {
    this.surveyService.save(this.survey)
      .subscribe((result: any) => {
        this.isVisible = false;
        this.survey = null;
        this.surveySavedEvent.emit(result); }
        , (err:any) => {
          this.surveySavedEvent.emit(null);
          throw err;
        });
  }

}
