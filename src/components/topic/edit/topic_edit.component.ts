import {Component, Input} from 'angular2/core';

import {TopicService, Topic} from '../topic.service';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {Change} from '../../../common/changeStatus';

@Component({
  selector: 'topic-edit',
  moduleId: module.id,
  providers: [TopicService],
  directives: [MaterializeDirective],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="topic" class="card" id="{{topic.id}}"  >
      <form (ngSubmit)="onSave()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" [(ngModel)]="topic.name" required>
            <label for="name" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"  [(ngModel)]="topic.abstractDescription" required></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s5">
            <label class="active teal-text">Type of Change</label>
            <select [(ngModel)]="topic.changeKind" materialize="material_select" required>
              <option value="" disabled selected>Select reason</option>
              <option *ngFor="#change of _ChangeEnums" [value]="change[0]">{{change[1]}}</option>
            </select>
          </div>
          <div class="input-field col s7">
            <label for="changeComment" class="active teal-text">Reason for change</label>
            <input id="changeComment" type="text" [(ngModel)]="topic.changeComment" required>
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

  private _ChangeEnums: any = Change.status;

  constructor(private topicService: TopicService) {
    this._ChangeEnums = [['IN_DEVELOPMENT','Work in progress'],
      ['TYPO','Ortographical adjustment'],
      ['CONCEPTUAL','Conceptual improvement'],
      ['EXTERNAL','Real life change'],
      ['OTHER','Other purpose']];
  }

  onSave() {
    console.log('save topic');
      this.topicService.edit(this.topic)
        .subscribe(result => {
        this.topic = result;
      });
  }

}
