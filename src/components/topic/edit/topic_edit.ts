import {Component, Input} from '../../../../node_modules/angular2/core.d';

import {TopicService, Topic} from '../topicservice';

@Component({
    selector: 'topic-edit',
    providers: [TopicService],
    template: `
  <div *ngIf="isVisible">
    <div *ngIf="topic" class="card" id="{{topic.id}}"  >
      <form (ngSubmit)="save()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" [(ngModel)]="topic.name" required>
            <label for="name" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"  [(ngModel)]="topic.description" required></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
		  <div class="input-field col s4">
              <label class="active teal-text">Version Reason</label>
              <select  class="browser-default input-sm"  [(ngModel)]="topic.changeKind">
                <option *ngFor="#changereason of changes" [value]="changereason">{{changereason}}</option>
              </select>
          </div>
          <div class="input-field col s8">
            <input type="text" [(ngModel)]="topic.changeComment" required>
            <label for="changeComment" class="active teal-text">Save Comment</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <div class="chip" *ngFor="#author of topic.authors" >
              <img src="{{author.picture}}">{{author.name}} <i class="material-icons">close</i>
            </div>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{topic.createdBy.agency.name}}</div>
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
    private changes:any;

    private service: TopicService;
  constructor(topicService: TopicService) {
      this.service = topicService;
      this.changes = ['IN_DEVELOPMENT','TYPO','NEW_MAJOR'];
    }
    save() {
        this.service.save(this.topic);
    }

}
