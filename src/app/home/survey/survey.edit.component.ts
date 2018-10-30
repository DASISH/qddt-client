import { Component, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { HomeService } from '../home.service';
import {SurveyProgram} from '../home.classes';

declare var $: any;

@Component({
  selector: 'qddt-survey-edit',

  template: `
<div *ngIf="isVisible && survey"  id="{{formId}}"  >
  <form materialize (ngSubmit)="onSave()" #surveyForm="ngForm">
    <div class="row input-field">
      <input id="{{formId}}-name" name="{{formId}}-name" type="text" [(ngModel)]="survey.name" required>
      <label for="{{formId}}-name" >Name</label>
    </div>

    <div class="row input-field">
      <textarea id="{{formId}}-desc" name="{{formId}}-description" class="materialize-textarea"
        [(ngModel)]="survey.description" required >
      </textarea>
      <label for="{{formId}}-desc">Description</label>
    </div>


    <qddt-rational [formName]="'RationalComp'" [element]="survey" [config]="{hidden: [2,3]}"></qddt-rational>

    <qddt-element-footer [element]="survey"> </qddt-element-footer>

    <div class="row right-align">
      <button type="submit" class="btn btn-default" [disabled]="!surveyForm.form.valid" >Submit</button>
    </div>
  </form>
</div>
`
})

export class SurveyEditComponent implements  AfterContentChecked {

  @Input() survey: SurveyProgram;
  @Input() readonly = false;
  @Input() isVisible = false;

  @Output() savedEvent = new EventEmitter<SurveyProgram>();

  public showRevision;
  public readonly formId = Math.round( Math.random() * 10000);
  constructor(private surveyService: HomeService) { }

  ngAfterContentChecked() {
    $('#' + this.formId + '-desc').trigger('autoresize');
  }

  onSave() {
    this.surveyService.update(this.survey)
      .subscribe((result: any) => {
        this.isVisible = false;
        this.survey = null;
        this.savedEvent.emit(result); }
        , (err: any) => {
          this.savedEvent.emit(null);
          throw err;
        });
  }

}
