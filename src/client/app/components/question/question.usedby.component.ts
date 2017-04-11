import { Component, Input, OnChanges } from '@angular/core';

import { QuestionService, Question } from './question.service';

@Component({
  selector: 'qddt-questionitem-usedby',
  moduleId: module.id,
  template: `
  <div *ngIf="question" class="row">
     <div class="card">
       <h4>Question</h4>
       <label>Version: {{question?.version?.major}}.{{question?.version?.minor}}</label>
       <div class="row">
         <label class="active teal-text">Name</label>
         <input type="text" [ngModel]="question.name" readonly>
       </div>
       <div class="row">
         <div class="col s12">
           <label class="active teal-text">Description</label>
           <textarea class="materialize-textarea"
             [ngModel]="question.description" readonly></textarea>
         </div>
       </div>
       <div class="row">
         <div class="input-field col s8">
           <p><label class="active teal-text">Authors</label></p>
           <qddt-author-chip [authors]="question.authors"></qddt-author-chip>
       </div>
       <div class="input-field col s4">
         <p><label class="active teal-text">Agency</label></p>
          <div class="chip" >{{question?.modifiedBy?.agency?.name}}</div>
         </div>
       </div>
   </div>
 </div>
  `,
  providers: [QuestionService],
})
export class QuestionUsedbyComponent implements OnChanges {

  @Input() id: string;

  question: Question;

  constructor(private questionService: QuestionService) {
  }

  ngOnChanges() {
    if (this.id !== null && this.id !== undefined) {
      this.questionService.getquestion(this.id).subscribe((result: any) => {
        this.question = result;
      });
    }
  }

}
