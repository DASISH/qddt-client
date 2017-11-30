import { Component, Input, Output,EventEmitter, AfterContentChecked } from '@angular/core';
import { SurveyService, SurveyProgram } from '../survey.service';

declare var Materialize:any;

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

        <!--<div class="row">-->
		      <qddt-rational [formName]="'RationalComp'" [element]="survey" [config]="{hidden: [2,3]}"></qddt-rational>
        <!--</div>-->

        <!--<div class="row">-->
          <qddt-element-footer [element]="survey" [type]="'survey'"></qddt-element-footer>
        <!--</div>-->

        <button [disabled]="!surveyForm.form.valid" type="submit" class="btn btn-default">Submit</button>
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
    this.isVisible = false;
    this.surveyService.save(this.survey)
      .subscribe((result: any) => {
        this.surveySavedEvent.emit(result);}
        ,(err: any) => console.log('ERROR: ', err));
  }

}
