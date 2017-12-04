import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { SurveyService, SurveyProgram } from './survey.service';
let saveAs = require('file-saver');

@Component({
  selector: 'qddt-survey',
  moduleId: module.id,
  templateUrl: './survey.component.html',
  providers: [SurveyService]
})
export class SurveyComponent implements OnChanges {
  @Input() show: boolean;
  @Output() surveySelectEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() surveyDeleteEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() entitySavedEvent: EventEmitter<String> = new EventEmitter<String>();

  showSurveyForm: boolean = false;
  private revisionisVisible: boolean = false;
  private surveys: any[]=[];
  private survey: any;

  constructor(private surveyService: SurveyService) {
    this.survey = new SurveyProgram();
  }

  ngOnChanges() {
    this.surveyService.getAll()
      .subscribe((data:Array<SurveyProgram>)  =>  {
        this.surveys = data;
      }
      ,(err: any) => console.log('ERROR: ', err));
  }

  onSurveySaved(surveyProgram:any) {
    this.surveys = this.surveys.filter((q) => q.id !== surveyProgram.id);
    this.surveys.push(surveyProgram);
    surveyProgram['isVisible']= false;
  }

  onShowStudy(surveyProgram: any) {
    this.show = false;
    this.surveySelectEvent.emit(surveyProgram);
  }

  onSave() {
    this.surveyService.create(this.survey)
      .subscribe((result: any) => this.onSurveySaved(result)
        ,(err: any) => console.log('ERROR: ', err));

    this.survey = new SurveyProgram();
    this.showSurveyForm = false;
  }

  getPdf(element: SurveyProgram) {
    let fileName = element.name + '.pdf';
    this.surveyService.getPdf(element.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      },
      error => console.log(error));
  }
}
