import { Component, Input, OnChanges } from '@angular/core';

import { StudyService, Study } from './study.service';

@Component({
  selector: 'qddt-study-usedby',
  moduleId: module.id,
  template: `
  <div *ngIf="study" class="row">
     <div class="card">
       <h4>Study</h4>
       <label>Version: {{study?.version?.major}}.{{study?.version?.minor}}</label>
       <div class="row">
         <label class="active teal-text">Name</label>
         <input type="text" [ngModel]="study.name" readonly>
       </div>
       <div class="row">
         <label class="active teal-text">Description</label>
          <textarea class="materialize-textarea"
            [ngModel]="study.description" readonly></textarea>
       </div>
       <div class="row">
         <div class="input-field col s8">
           <p><label class="active teal-text">Authors</label></p>
           <qddt-author-chip [authors]="study.authors"></qddt-author-chip>
       </div>
       <div class="input-field col s4">
         <p><label class="active teal-text">Agency</label></p>
          <div class="chip" >{{study?.modifiedBy?.agency?.name}}</div>
         </div>
       </div>
   </div>
 </div>
  `,
  providers: [StudyService],
})
export class StudyUsedbyComponent implements OnChanges {

  @Input() id: string;

  study: Study;

  constructor(private studyService: StudyService) {
  }

  ngOnChanges() {
    if (this.id !== null && this.id !== undefined) {
      this.studyService.getStudy(this.id).subscribe((result: any) => {
        this.study = result;
      });
    }
  }

}
