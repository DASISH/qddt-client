import { Component, Input } from '@angular/core';
import {Study} from '../../../lib';

@Component({
  selector: 'qddt-preview-study',

  template: `
  <div class="row" *ngIf="study?.description">
    <div class="input-field col s11">
      <label class="active teal-text">Description</label>
      <P [innerHtml]="study?.description"></P>
    </div>
  </div>
  <div class="row" *ngIf="study.authors && study.authors.length>0">
    <p><label class="active teal-text">Authors</label></p>
    <qddt-author-chip [authors]="study.authors"></qddt-author-chip>
  </div>
  <div class="row">
    <qddt-comment-list [ownerId]="study.id" [comments]="study.comments"></qddt-comment-list>
  </div>
  <div class="row" *ngIf="study?.topicGroups && study?.topicGroups?.length>0">
    <qddt-preview-topic-list [topicList]="study.topicGroups"></qddt-preview-topic-list>
  </div>
  <div class="row">
    <qddt-element-footer [element]="study" ></qddt-element-footer>
  </div>`
  ,
  providers: [ ],
})

export class PreviewStudyComponent {
  @Input() study: Study;
}
