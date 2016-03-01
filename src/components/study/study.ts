import {Component, Input, EventEmitter, Output, ElementRef} from 'angular2/core';

import {StudyService, Study} from './studyservice';
import {StudyCreateComponent} from './create';
import {CommentListComponent} from '../comment/comment_list';

@Component({
  selector: 'study',
  templateUrl: './components/study/study.html',
  providers: [StudyService],
  directives: [StudyCreateComponent, CommentListComponent]

})
export class StudyComponent {

  showStudyForm: boolean = false;
  @Output() studyCreateEvent: EventEmitter<any> = new EventEmitter();
  @Input() surveyProgram: any;
  private studies: any;
  private activeStudy: any;

  constructor(private studyService: StudyService, private elementRef: ElementRef) {

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
    this.studyService.save(this.activeStudy,this.surveyProgram.id);
    this.activeStudy  = new Study();
  }

  toggleStudyForm() {
    //jQuery(this.elementRef.nativeElement).find('select').material_select();
    this.showStudyForm = !this.showStudyForm;
  }

  create(study: any) {
    this.studyCreateEvent.emit(study);
  }

}
