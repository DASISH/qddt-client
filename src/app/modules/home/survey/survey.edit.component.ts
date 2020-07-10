import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SurveyProgram, TemplateService } from '../../../lib';


@Component({
  selector: 'qddt-survey-edit',
  providers: [{ provide: 'elementKind', useValue: 'SURVEY_PROGRAM' },],
  template: `
<div *ngIf="isVisible">
  <form class="row" id="{{formId}}" (ngSubmit)="onSave()" #ngForm="ngForm">
      <qddt-input name="name"
        required
        label="Name"
        [(ngModel)]="survey.name"
        data-length="250">
      </qddt-input>
      <qddt-textarea name="description"
        required
        label="Description"
        [(ngModel)]="survey.description"
        data-length="10000">
      </qddt-textarea>
      <qddt-rational  [formName]="'RationalComp'" [element]="survey" [config]="{hidden: [2,3]}"></qddt-rational>
      <qddt-element-footer  [element]="survey"> </qddt-element-footer>
    <div class="col s12 right-align">
      <button type="submit" class="btn btn-default" [disabled]="!ngForm.form.valid" >Submit</button>
    </div>
  </form>
</div>
`
})

export class SurveyEditComponent {
  @Input() survey: SurveyProgram;
  @Output() savedEvent = new EventEmitter<SurveyProgram>();

  public isVisible = false;
  public showRevision = false;    // used by parent form to keep track of revision comp
  public readonly formId = Math.round(Math.random() * 10000);

  constructor(private service: TemplateService) { }

  onSave() {
    this.service.update<SurveyProgram>(this.survey)
      .subscribe((result) => {
        this.survey = null;
        this.isVisible = true;
        this.savedEvent.emit(result);
      }
        , (err: any) => {
          this.savedEvent.emit(null);
          throw err;
        });
  }
}
