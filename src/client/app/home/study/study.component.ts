import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { StudyService, Study } from './study.service';
const saveAs = require('file-saver');

@Component({
  selector: 'qddt-study',
  moduleId: module.id,
  templateUrl: './study.component.html',
  providers: [StudyService],
})
export class StudyComponent implements OnChanges {

  @Output() studySelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() survey: any;
  @Input() show= false;

  showEditForm = false;
  private study: any;
  private studies: any[];

  constructor(private studyService: StudyService) {
    this.study = new Study();
  }

  ngOnChanges() {
    this.studies = this.survey.studies;
    console.log(this.studies.length);
    console.log(this.survey.name);
    console.log(this.studies[0].name);
  }

  onStudySelect(study: any) {
    this.show = false;
    this.studySelectedEvent.emit(study);
  }

  onToggleStudyForm() {
    this.showEditForm = !this.showEditForm;
  }

  onStudySavedEvent(study: any) {
    this.studies = this.studies.filter((s: any) => s.id !== study.id);
    this.studies.push(study);
  }

  onSave() {
    this.showEditForm = false;
    this.studyService.save(this.study, this.survey.id).subscribe((result: any) => {
      this.studies.push(result);
    });
    this.study  = new Study();
  }

  getPdf(element: Study) {
    const fileName = element.name + '.pdf';
    this.studyService.getPdf(element.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      },
      error => console.log(error));
  }

  onRemoveStudy(studyId: string) {
    if (studyId && studyId.length === 36) {
      this.studyService.deleteStudy(studyId)
        .subscribe((result: any) => {
            const i = this.studies.findIndex(q => q['id'] === studyId);
            if (i >= 0) {
              this.studies.splice(i, 1);
            }
          },
          (error: any) => {
            console.log(error);

          });
    }
  }
}
