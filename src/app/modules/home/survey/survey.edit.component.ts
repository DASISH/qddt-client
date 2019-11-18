import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { SurveyProgram, TemplateService } from '../../../lib';


@Component({
  selector: 'qddt-survey-edit',
  providers: [{ provide: 'elementKind', useValue: 'SURVEY_PROGRAM' },],
  template: `
<div *ngIf="isVisible">
  <form class="row" id="{{formId}}" (ngSubmit)="onSave()" #surveyForm="ngForm">
    <div class="col s12">
      <qddt-input name="name"
        required
        placeholder="Name me"
        label="Name"
        [(ngModel)]="survey.name"
        data-length="250">
      </qddt-input>
    </div>
    <div class="col s12">
      <qddt-textarea name="description"
        required
        placeholder="Name me"
        label="Description"
        [(ngModel)]="survey.description"
        data-length="10000">
      </qddt-textarea>
    </div>
    <div class="col s12">
        <qddt-rational  [formName]="'RationalComp'" [element]="survey" [config]="{hidden: [2,3]}"></qddt-rational>
    </div>
    <div class="col s12">
        <qddt-element-footer  [element]="survey"> </qddt-element-footer>
    </div>
    <div class="col s12 right-align">
      <button type="submit" class="btn btn-default" [disabled]="!surveyForm.form.valid" >Submit</button>
    </div>
  </form>
</div>
`
})

export class SurveyEditComponent implements AfterViewInit {
  @Input() survey: SurveyProgram;
  @Input() readonly = false;
  @Input() isVisible = false;

  @Output() savedEvent = new EventEmitter<SurveyProgram>();

  public showRevision = false;

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

  // ngAfterContentChecked(): void {
  //   document.querySelectorAll('textarea').forEach(
  //     input => M.textareaAutoResize(input));
  // }

  ngAfterViewInit(): void {
    // document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
    //   input => M.CharacterCounter.init(input));
    // document.querySelectorAll('textarea').forEach(
    //   input => M.textareaAutoResize(input));
    // M.updateTextFields();
  }

}
