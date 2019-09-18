import { Component, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { SurveyProgram} from '../../../lib';
import { TemplateService} from '../../../components/template';

declare var $: any;

@Component({
  selector: 'qddt-survey-edit',
  providers: [ {provide: 'elementKind', useValue: 'SURVEY_PROGRAM'}, ],
  template: `
<div *ngIf="isVisible && survey"  id="{{formId}}"  >
  <form materialize (ngSubmit)="onSave()" #surveyForm="ngForm">
    <div class="row input-field">
      <input name="{{formId}}-name" type="text" [(ngModel)]="survey.name" required  data-length ="250" materialize="characterCounter">
      <label>Name</label>
    </div>

    <div class="row input-field">
      <textarea name="{{formId}}-description" class="materialize-textarea"
        [(ngModel)]="survey.description" required  data-length ="10000" materialize="characterCounter">
      </textarea>
      <label>Description</label>
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
  constructor(private service: TemplateService) { }

  ngAfterContentChecked() {
    $('#' + this.formId + '-desc').trigger('autoresize');
  }

  onSave() {
    this.service.update<SurveyProgram>(this.survey)
      .subscribe((result) => {
        this.isVisible = false;
        this.survey = null;
        this.savedEvent.emit(result); }
        , (err: any) => {
          this.savedEvent.emit(null);
          throw err;
        });
  }

}
