import {Component, Input, EventEmitter, Output, ElementRef} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {SurveyService, SurveyProgram} from './survey.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {SurveyProgramEditComponent} from './edit/surveyprogram_edit.component';
import {SurveyProgramRevision} from './surveyprogram_revision.component';
import {AuthorChipComponent} from '../author/author_chip.component';

@Component({
  selector: 'surveyprogram',
  moduleId: module.id,
  templateUrl: './surveyprogram.component.html',
  directives: [CommentListComponent, SurveyProgramEditComponent, SurveyProgramRevision, AuthorChipComponent],
  pipes: [LocalDatePipe],
  providers: [SurveyService]
})
export class SurveyProgramComponent {

  showSurveyForm: boolean = false;
  @Input() show: boolean;
  @Output() surveySelectEvent: EventEmitter<String> = new EventEmitter();
  @Output() surveyDeleteEvent: EventEmitter<String> = new EventEmitter();
  @Output() entitySavedEvent: EventEmitter<String> = new EventEmitter();

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
      ,(err) => console.log('ERROR: ', err));
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
      .subscribe(result => this.onSurveySaved(result)
        ,(err) => console.log('ERROR: ', err));

    this.survey = new SurveyProgram();
    this.showSurveyForm = false;
  }

}
