import {Component, Input} from 'angular2/core';

import {TopicService, Topic} from './topic.service';

@Component({
  selector: 'topic-create',
  moduleId: module.id,
  providers: [TopicService],
  template: `
      <a class="btn" (click)="toggleForm()">
      <i class="material-icons right" *ngIf="!showForm">keyboard_arrow_down</i>
      <i class="material-icons right" *ngIf="showForm">keyboard_arrow_up</i>
      New</a>

      <div *ngIf="showForm">
        <div class="card-action">
          <form (ngSubmit)="save()" #hf="ngForm">
            <div class="row">
              <div class="input-field col">
                <input id="name" type="text" [(ngModel)]="topic.name" required>
                <label for="name" class="white-text">Name</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s10">
                <textarea id="description" class="materialize-textarea" [(ngModel)]="topic.abstract_description" required></textarea>
                <label for="description" class="white-text">Description</label>
              </div>
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
          </form>
        </div>
      </div>
  `

})
export class TopicCreateComponent {

  @Input() study: any;
  showForm: boolean = false;
  private topic: Topic;

  constructor(private topicService: TopicService) {
    this.topic = new Topic();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  save() {
    this.topicService.save(this.topic);
    this.topic = new Topic();
  }

}
