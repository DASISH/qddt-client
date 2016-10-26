import { Component, Input } from '@angular/core';

import { TopicService, Topic } from '../topic.service';
import { Change } from '../../../common/change_status';

@Component({
  selector: 'topic-edit',
  moduleId: module.id,
  providers: [TopicService],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="topic" class="card" id="{{topic.id}}"  >
      <form (ngSubmit)="onSave()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input id="{{topic?.id}}-name"
              name="{{topic?.id}}-name"type="text" [(ngModel)]="topic.name" required>
            <label [attr.for]="topic.id + '-name'" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea id="{{topic?.id}}-description" name="{{topic?.id}}-description"
              class="materialize-textarea"  [(ngModel)]="topic.abstractDescription" required></textarea>
            <label [attr.for]="topic.id + '-description'" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
          <qddt-rational [element]="topic"></qddt-rational>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <author-chip-edit [authors]="topic.authors"  
              (authorRemovedEvent)="onAuthorRemoved($event)" 
              (authorSelectedEvent)="onAuthorSelected($event)"></author-chip-edit>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{topic.modifiedBy.agency.name}}</div>
          </div>
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
  private _ChangeEnums: any;
  private showlabel: boolean = false;

  constructor(private topicService: TopicService) {
    this._ChangeEnums = Change.status;
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

  onAuthorSelected(author:any) {
    this.topicService.attachAuthor(this.topic.id,author.id);
    this.topic.authors.push(author);
  }

  onAuthorRemoved(author:any) {
    this.topicService.deattachAuthor(this.topic.id,author.id);
    var i = this.topic.authors.findIndex(F=>F===author);
    this.topic.authors.splice(i,1);
  }
}