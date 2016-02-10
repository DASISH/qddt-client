import {Component, Input, EventEmitter, Output} from 'angular2/core';

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

  @Input() surveyProgram: any;
  @Output() selectedStudy: EventEmitter<any> = new EventEmitter();
  private studies: any;
  private activeStudy: any;

  constructor(private studyService: StudyService) {

  }

  ngOnChanges() {
    this.studies = this.surveyProgram.studies;
  }

  selectStudy(activeStudy: any) {
    this.selectedStudy.emit(null);
    this.activeStudy = activeStudy;
  }

}
