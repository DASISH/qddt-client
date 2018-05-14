import { Component, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { HomeService } from '../home.service';
import {SurveyProgram} from '../home.classes';


@Component({
  selector: 'qddt-survey-edit',
  moduleId: module.id,
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="survey" id="{{survey.id}}"  >
      <form materialize (ngSubmit)="onSave()" #surveyForm="ngForm">
        <div class="row input-field">
            <input id="{{survey?.id}}-name" name="{{survey?.id}}-name" type="text" [(ngModel)]="survey.name" required>
              <label for="{{survey?.id}}-name" >Name</label>
        </div>
        <div class="row input-field">
            <textarea id="{{survey?.id}}-description" name="{{survey?.id}}-description"
              class="materialize-textarea"  [(ngModel)]="survey.description" required autosize></textarea>
            <label for="{{survey?.id}}-description">Description</label>
        </div>

        <qddt-rational [formName]="'RationalComp'" [element]="survey" [config]="{hidden: [2,3]}"></qddt-rational>

        <qddt-element-footer [element]="survey"> </qddt-element-footer>

        <div class="row right-align">
          <button type="submit" class="btn btn-default" [disabled]="!surveyForm.form.valid" >Submit</button>
        </div>
      </form>
    </div>
  </div>

  `
})

export class SurveyEditComponent  {

  @Input() survey: SurveyProgram;
  @Input() isVisible: boolean;
  @Output() savedEvent = new EventEmitter<SurveyProgram>();
  public showRevision = false;

  private refreshCount = 0;

  constructor(private surveyService: HomeService) {
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
