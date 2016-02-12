import {Component, Input, EventEmitter, Output, ElementRef} from 'angular2/core';

import {StudyService, Study} from './studyservice';
import {StudyCreateComponent} from './create';
import {CommentListComponent} from '../comment/comment_list';

import {StudyEditComponent} from './edit/study_edit';
// import {SurveyProgramRevision} from './surveyprogram_revision';

@Component({
  selector: 'study',
  templateUrl: './components/study/study.html',
  providers: [StudyService],
  directives: [StudyCreateComponent, CommentListComponent]

})
export class StudyComponent {

  showStudyForm: boolean = false;

  @Input() surveyProgram: any;
  private studies: any;
  private activeStudy: any;
  @Output() studyCreateEvent: EventEmitter<any> = new EventEmitter();

  constructor(private studyService: StudyService) {

  }

  ngOnChanges() {
    this.studies = this.surveyProgram.studies;
  }

  selectStudy(study: any) {
    this.studyCreateEvent.emit(null);
    this.activeStudy = study;
  }

  save() {
    this.showStudyForm = false;
    this.studyService.save(this.activeStudy);
    this.activeStudy  = new Study();
  }

  toggleStudyForm() {
    jQuery(this.elementRef.nativeElement).find('select').material_select();
    this.showSurveyForm = !this.showSurveyForm;
  }

  create(study: any) {
    this.studyCreateEvent.emit(study);
  }

}
