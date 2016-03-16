import {Component, Input, EventEmitter, Output} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {StudyService, Study} from './study.service';
import {StudyCreateComponent} from './create.component';
import {StudyEditComponent} from './edit/study_edit.component';
import {StudyRevision} from './study_revision.component';
import {CommentListComponent} from '../comment/comment_list.component';

@Component({
  selector: 'study',
  moduleId: module.id,
  templateUrl: './study.component.html',
  pipes: [LocalDatePipe],
  providers: [StudyService],
  directives: [StudyCreateComponent, CommentListComponent, StudyEditComponent, StudyRevision]

})
export class StudyComponent {

  showStudyForm: boolean = false;
  @Output() studySelectedEvent: EventEmitter<any> = new EventEmitter();
  @Input() survey: any;
  @Input() show: boolean;

  private study: any;
  private studies: any;


  constructor(private studyService: StudyService) {
    this.study = new Study();
  }

  ngOnChanges() {
    this.studies = this.survey.studies;
  }

  onStudySelect(study: any) {
    this.studySelectedEvent.emit(study);
  }

  onToggleStudyForm() {
    this.showStudyForm = !this.showStudyForm;
  }

  onSave() {
    this.showStudyForm = false;
    this.studyService.save(this.study,this.survey.id).subscribe(result => {
      this.studies.push(result);
    });
    this.study  = new Study();
  }



}
