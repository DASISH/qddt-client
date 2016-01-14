import {Component, Input, EventEmitter, Output, ElementRef} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {SurveyService, SurveyProgram} from './surveyservice';
import {CommentListComponent} from '../comment/comment_list';
import {SurveyProgramEditComponent} from './edit/surveyprogram_edit';
import {SurveyProgramRevision} from './surveyprogram_revision';

declare var jQuery:any;

@Component({
  selector: 'surveyprogram',
  templateUrl: './components/surveyprogram/surveyprogram.html',
  directives: [CommentListComponent, SurveyProgramEditComponent, SurveyProgramRevision],
  pipes: [LocalDatePipe],
  providers: [SurveyService]
})
export class SurveyProgramComponent {

  showSurveyForm: boolean = false;
  @Input() showSurveyProgram: boolean;
  model: SurveyProgram;
  surveyPrograms: Array<SurveyProgram> = [];
  @Output() surveyCreateEvent: EventEmitter<String> = new EventEmitter();

  constructor(private surveyService: SurveyService, private elementRef: ElementRef) {
    this.model = new SurveyProgram();
    this.surveyPrograms = this.surveyService.getModel();
  }

  ngOnInit() {
    console.log("init");
    jQuery(this.elementRef.nativeElement).find('select').material_select();
  }

  save() {
    this.showSurveyForm = false;
    this.surveyService.save(this.model);
    this.surveyPrograms = this.surveyService.getModel();
    this.model = new SurveyProgram();
  }

  toggleSurveyForm() {
    jQuery(this.elementRef.nativeElement).find('select').material_select();
    this.showSurveyForm = !this.showSurveyForm;
  }

  create(surveyProgram: any) {
    this.surveyCreateEvent.emit(surveyProgram);
  }

}
