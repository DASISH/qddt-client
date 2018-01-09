import { Component, Input } from '@angular/core';
import { Study } from '../../home/study/study.service';

@Component({
  selector: 'qddt-preview-study',
  moduleId: module.id,
  template: `
  <div class="row">
    <div class="col s12">
      <label [attr.for]="study.id + '-description'" class="active teal-text">Description</label>
      <textarea class="materialize-textarea" id="{{study?.id}}-description"
      name="{{study?.id}}-description" readonly>
      </textarea>
    </div>
  </div>
  <div class="row" *ngIf="study.authors && study.authors.length>0">
    <p><label class="active teal-text">Authors</label></p>
    <qddt-author-chip [authors]="study.authors"></qddt-author-chip>
  </div>
  <div class="row">
    <qddt-comment-list [ownerId]="study.id" [comments]="study.comments"></qddt-comment-list>
  </div>
  <div class="row" *ngIf="study.topics && study.topics.length>0">
    <qddt-preview-topic-list [topicList]="study.topics"></qddt-preview-topic-list>
  </div>
  <div class="row">
    <qddt-element-footer [element]="study" [type]="'study'"></qddt-element-footer>
  </div>`
  ,
  providers: [ ],
})

export class PreviewStudyComponent {
  @Input() study: Study;
}
