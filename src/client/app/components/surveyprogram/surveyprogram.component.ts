import { Component, Input, EventEmitter, Output, ElementRef } from '@angular/core';

import {SurveyService, SurveyProgram} from './survey.service';

@Component({
  selector: 'surveyprogram',
  moduleId: module.id,
  templateUrl: './surveyprogram.component.html',
  providers: [SurveyService]
})
export class SurveyProgramComponent {

  showSurveyForm: boolean = false;
  @Input() show: boolean;
  @Output() surveySelectEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() surveyDeleteEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() entitySavedEvent: EventEmitter<String> = new EventEmitter<String>();

  private surveys: any[]=[];
  private survey: any;

  constructor(private surveyService: SurveyService, private elementRef: ElementRef) {
    this.survey = new SurveyProgram();
  }

  ngOnChanges() {
    this.surveys = [];
    this.surveyService.getAll()
      .subscribe((data:Array<SurveyProgram>)  =>  {
              data.forEach(s => this.surveys.push(s));
            }
      ,(err: any) => console.log('ERROR: ', err));
  }

  onSurveySaved(surveyProgram:any) {
    this.surveys = this.surveys.filter((q) => q.id !== surveyProgram.id);
    this.surveys.push(surveyProgram);
  }

  onSurveySelect(surveyProgram: any) {
    this.surveySelectEvent.emit(surveyProgram);
    this.show = false;
  }

  onDelete(surveyProgram: any) {
    console.log('delete -> not implemented');
    this.surveyDeleteEvent.emit(surveyProgram);
    //this.surveyService.delete(surveyProgram);
  }

  onSave() {
    this.surveyService.save(this.survey)
      .subscribe((result: any) => this.onSurveySaved(result)
        ,(err: any) => console.log('ERROR: ', err));

    this.survey = new SurveyProgram();
    this.showSurveyForm = false;
  }

}
