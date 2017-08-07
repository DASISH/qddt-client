import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';

import { SurveyService, SurveyProgram } from './survey.service';

@Component({
  selector: 'qddt-survey',
  moduleId: module.id,
  templateUrl: './survey.component.html',
  providers: [SurveyService]
})
export class SurveyComponent implements OnChanges {

  showSurveyForm: boolean = false;
  @Input() show: boolean;
  @Output() surveySelectEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() surveyDeleteEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() entitySavedEvent: EventEmitter<String> = new EventEmitter<String>();

  private surveys: any[]=[];
  private survey: any;

  constructor(private surveyService: SurveyService) {
    this.survey = new SurveyProgram();
  }

  ngOnChanges() {
    this.surveyService.getAll()
      .subscribe((data:Array<SurveyProgram>)  =>  {
        this.surveys = data;
        this.surveys.forEach(s => {
          s.savedVersion = 'V' + s.version.major + '.' + s.version.minor;
          // s.workinprogress = (s.version.versionLabel === 'In Development');
        });
      }
      ,(err: any) => console.log('ERROR: ', err));
  }

  onSurveySaved(surveyProgram:any) {
    this.surveys = this.surveys.filter((q) => q.id !== surveyProgram.id);
    surveyProgram.savedVersion = 'V' + surveyProgram.version.major + '.' + surveyProgram.version.minor;
    // surveyProgram.workinprogress = (surveyProgram.version.versionLabel === 'In Development');
    this.surveys.push(surveyProgram);
  }

  onSurveySelect(surveyProgram: any) {
    this.surveySelectEvent.emit(surveyProgram);
    this.show = false;
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
