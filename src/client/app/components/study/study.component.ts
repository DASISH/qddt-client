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
  private studies: any[];

  constructor(private studyService: StudyService) {
    this.study = new Study();
  }

  ngOnChanges() {
    this.studies = this.survey.studies;
    this.studies.forEach((study: any) => {
      study.workinprogress = (study.version.versionLabel === 'In Development');
    });
  }

  onStudySelect(study: any) {
    this.studySelectedEvent.emit(study);
  }

  onToggleStudyForm() {
    this.showStudyForm = !this.showStudyForm;
  }

  onStudySavedEvent(study: any) {
    this.studies = this.studies.filter((s: any) => s.id !== study.id);
    study.workinprogress = (study.version.versionLabel === 'In Development');
    this.studies.push(study);
  }

  onSave() {
    this.showStudyForm = false;
    this.studyService.save(this.study,this.survey.id).subscribe((result: any) => {
      this.studies.push(result);
    });
    this.study  = new Study();
  }

  getPdf(element: Study) {
    let fileName = element.name + '.pdf';
    this.studyService.getPdf(element.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      },
      error => console.log(error));
  }
}
