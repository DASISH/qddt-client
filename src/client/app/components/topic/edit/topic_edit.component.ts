import { Component, Input } from '@angular/core';

import { TopicService, Topic } from '../topic.service';

@Component({
  selector: 'topic-edit',
  moduleId: module.id,
  providers: [TopicService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="topic" class="card" id="{{topic.id}}"  >
      <form (ngSubmit)="onSave()" #hf="ngForm">
        <div class="row">
          <div class="col s12">
            <label [attr.for]="topic.id + '-name'" class="active teal-text">Name</label>          
            <input id="{{topic?.id}}-name"
              name="{{topic?.id}}-name"type="text" [(ngModel)]="topic.name" required>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <label [attr.for]="topic.id + '-description'" class="active teal-text">Description</label>            
            <textarea id="{{topic?.id}}-description" name="{{topic?.id}}-description"
              class="materialize-textarea"  [(ngModel)]="topic.abstractDescription" required></textarea>
          </div>
        </div>
        <div class="row">
          <qddt-revision-detail [element]="topic" [type]="'topic'"></qddt-revision-detail>
        </div>
        <div class="row">
          <qddt-rational [element]="topic"></qddt-rational>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>
`
})

export class TopicEditComponent {

  @Input() topic: Topic;
  @Input() isVisible: boolean;
  private showlabel: boolean = false;

  constructor(private topicService: TopicService) {
  }

  onSave() {
    this.isVisible = false;
    console.log('save topic');
      this.topicService.edit(this.topic)
        .subscribe((result: any) => {
        this.topic = result;
      });
  }

  onChangeKind(value:any) {
    this.showlabel = (value === 'MILESTONE');
  }

}
