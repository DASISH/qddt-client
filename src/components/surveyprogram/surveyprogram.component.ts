import {Component, Input, EventEmitter, Output, ElementRef} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {SurveyService, SurveyProgram} from './survey.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {SurveyProgramEditComponent} from './edit/surveyprogram_edit.component';
import {SurveyProgramRevision} from './surveyprogram_revision.component';

@Component({
  selector: 'surveyprogram',
  moduleId: module.id,
  templateUrl: './surveyprogram.component.html',
  directives: [CommentListComponent, SurveyProgramEditComponent, SurveyProgramRevision],
  pipes: [LocalDatePipe],
  providers: [SurveyService]
})
export class SurveyProgramComponent {

  showSurveyForm: boolean = false;
  @Input() show: boolean;
  @Output() surveySelectEvent: EventEmitter<String> = new EventEmitter();
  @Output() surveyDeleteEvent: EventEmitter<String> = new EventEmitter();
  @Output() entitySavedEvent: EventEmitter<String> = new EventEmitter();
  private surveys: any;
  private survey: SurveyProgram;


  constructor(private surveyService: SurveyService, private elementRef: ElementRef) {
    this.survey = new SurveyProgram();
  }

  ngOnChanges() {
    this.surveys =  this.surveyService.getModel();
  }

  onSave() {
    this.showSurveyForm = false;
    this.surveyService.save(this.survey);
    this.surveys = this.surveyService.getModel();
    this.survey = new SurveyProgram();
  }

  onToggleSurveyForm() {
    this.showSurveyForm = !this.showSurveyForm;
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


}
