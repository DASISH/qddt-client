import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';

import { StudyService, Study } from './study.service';

@Component({
  selector: 'qddt-study',
  moduleId: module.id,
  templateUrl: './study.component.html',
  providers: [StudyService],
})
export class StudyComponent implements OnChanges {

  showStudyForm: boolean = false;
  @Output() studySelectedEvent: EventEmitter<any> = new EventEmitter<any>();
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
    this.studyService.save(this.study,this.survey.id).subscribe((result: any) => {
      this.studies.push(result);
    });
    this.study  = new Study();
  }

}
