import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ElementKind, SurveyProgram, TemplateService } from '../../../lib';


@Component({
  selector: 'qddt-survey-edit',
  providers: [{ provide: 'elementKind', useValue: 'SURVEY_PROGRAM' },],
  template: `
<ng-container *ngIf="isVisible">
  <form class="row" id="{{formId}}" (ngSubmit)="onSave()" #ngForm="ngForm">
  <qddt-input name="name"
        required
        label="Name"
        placeholder="coded or verbose name for survey"
        [(ngModel)]="survey.name"
        data-length="250">
      </qddt-input>
      <qddt-input name="label"
        required
        label="Label"
        placeholder="short displayname for survey"
        [(ngModel)]="survey.label"
        data-length="40">
      </qddt-input>
      <qddt-textarea name="description"
        required
        label="Description"
        placeholder="Describe why it was decided to start on this enquire..."
        [(ngModel)]="survey.description"
        data-length="20000">
      </qddt-textarea>
      <qddt-rational  [formName]="'RationalComp'" [element]="survey" [config]="{hidden: [2,3]}"></qddt-rational>
      <qddt-element-footer  [element]="survey"> </qddt-element-footer>
    <div class="col s12 right-align">
      <button type="submit" class="btn btn-default" [disabled]="!ngForm.form.valid" >Submit</button>
    </div>
  </form>
</ng-container>
`
})

export class SurveyEditComponent implements OnInit {
  @Input() survey: SurveyProgram;
  @Output() savedEvent = new EventEmitter<SurveyProgram>();

  public isVisible = false;
  public showRevision = false;    // used by parent form to keep track of revision comp
  public readonly formId = Math.round(Math.random() * 10000);
  private readonly SURVEY = ElementKind.SURVEY_PROGRAM;

  constructor(private service: TemplateService) {

  }

  ngOnInit(): void {
    // this.service.getByKindEntity<SurveyProgram>(this.SURVEY, this.survey.id)
    //   .then((result) => {
    //     this.survey = result;
    //   });
  }


  onSave() {
    this.service.update<SurveyProgram>(this.survey)
      .subscribe((result) => {
        // this.survey = null;
        this.isVisible = false;
        this.savedEvent.emit(result);
      }
        , (err: any) => {
          this.savedEvent.emit(null);
          throw err;
        });
  }
}
