import { Component, Input } from '@angular/core';
import { Topic, TopicService } from '../home/topic/topic.service';
const saveAs = require('file-saver');

@Component({
  selector: 'qddt-preview-topic',
  moduleId: module.id,
  styles: [
    'ul .collapsible { margin:20px; padding:5px; !important;}',
  ],
  template: `
<div class="row" *ngIf="topic?.abstractDescription">
  <div class="input-field col s11">
    <label class="active teal-text">Description</label>
    <p [innerHtml]="topic?.abstractDescription"></p>
  </div>
</div>
<div class="row" *ngIf="topic?.otherMaterials && topic.otherMaterials.length >0">
  <label class="teal-text">External aid</label>
</div>
<div class="row" *ngIf="topic?.otherMaterials && topic.otherMaterials.length >0">
  <ul>
    <li *ngFor="let m of topic.otherMaterials;" class="col s12 m6 l3">
        <a class="waves-effect waves-light" (click)="onDownloadFile(m)">
        <i class="material-icons center smal">description</i> {{ m.originalName }}</a>
    </li>
  </ul>
</div>
<div class="section" *ngIf="topic?.topicGroupQuestions && topic?.topicGroupQuestions?.length>0" style="margin:20px; padding:5px;">
  <ul class="collapsible popout"  *ngIf="topic?.topicGroupQuestions" materialize="collapsible"
    data-collapsible="expandable" style="padding: 5pt;">
    <li *ngFor="let cqi of topic?.topicGroupQuestions;">
      <div class="collapsible-header green lighten-5">
        <div class="row"  style="margin-bottom: 0;">
          <div class="col s10">QuestionItem [{{ cqi?.questionItem?.name }}]</div>
        </div>
      </div>
      <div class="collapsible-body">
          <qddt-preview-questionitem [questionItem]="cqi.questionItem"></qddt-preview-questionitem>
      </div>
    </li>
  </ul>
</div>
<div class="row">
  <qddt-comment-list [ownerId]="topic.id" [comments]="topic.comments"></qddt-comment-list>
</div>
<div class="row" *ngIf="topic.concepts && topic.concepts.length>0" >
  <qddt-preview-concept-list [conceptList]="topic.concepts"></qddt-preview-concept-list>
</div>
<div class="row">
  <qddt-element-footer [element]="topic" [type]="'topic'"></qddt-element-footer>
</div>`
,
  providers: [ TopicService],
})

export class PreviewTopicComponent {
  @Input() topic: Topic;

  constructor(private service: TopicService) {
  }

  onDownloadFile(o: any) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data: any) => {
        saveAs(data, fileName);
      });
  }
}
