import { Component, Input, OnChanges } from '@angular/core';

import { TopicService, Topic } from './topic.service';

@Component({
  selector: 'qddt-topic-usedby',
  moduleId: module.id,
  template: `
  <div *ngIf="topic" class="row">
     <div class="card">
       <h4>Module</h4>
       <label>Version: {{topic?.version?.major}}.{{topic?.version?.minor}}</label>
       <div class="row">
         <label class="active teal-text">Name</label>
         <input type="text" [ngModel]="topic.name" readonly>
       </div>
       <div class="row">
         <div class="col s12">
           <label class="active teal-text">Description</label>
           <textarea class="materialize-textarea"
             [ngModel]="topic.description" readonly></textarea>
         </div>
       </div>
       <div class="row">
         <div class="input-field col s8">
           <p><label class="active teal-text">Authors</label></p>
           <qddt-author-chip [authors]="topic.authors"></qddt-author-chip>
       </div>
       <div class="input-field col s4">
         <p><label class="active teal-text">Agency</label></p>
          <div class="chip" >{{topic.modifiedBy.agency.name}}</div>
         </div>
       </div>
   </div>
 </div>
  `,
  providers: [TopicService],
})
export class TopicUsedbyComponent implements OnChanges {

  @Input() id: string;

  private topic: Topic;

  constructor(private topicService: TopicService) {
  }

  ngOnChanges() {
    if (this.id !== null && this.id !== undefined) {
      this.topicService.getTopic(this.id).subscribe((result: any) => {
        this.topic = result;
      });
    }
  }

}
