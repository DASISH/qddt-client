import { Component, Input, OnChanges } from '@angular/core';
import { StudyService } from './study.service';

@Component({
  selector: 'qddt-study-usedby',
  moduleId: module.id,
  template: `
<div *ngIf="study" class="row">
  <!--<qddt-preview-study [study]="study"></qddt-preview-study>-->
</div>
`,
  providers: [StudyService],
})
export class StudyUsedbyComponent implements OnChanges {

  @Input() id: string;
  study: any;

  constructor(private studyService: StudyService) { }

  ngOnChanges() {
    if (this.id !== null && this.id !== undefined) {
      this.studyService.getStudy(this.id).subscribe((result: any) => {
        this.study = result;
      });
    }
  }

}
