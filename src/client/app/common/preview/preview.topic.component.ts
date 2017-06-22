import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-preview-topic',
  moduleId: module.id,
  styles: [
    'ul .collapsible { margin:20px; padding:5px; important!;}',
  ],
  template:`
  <div class="row"> 
    <div class="col s12">
      <label [attr.for]="topic.id + '-description'" class="active teal-text">Description</label>
      <textarea class="materialize-textarea" id="{{topic?.id}}-description"
      name="{{topic?.id}}-description" readonly>{{topic.abstractDescription}}
      </textarea>
    </div>
  </div>
  <div class="section" *ngIf="topic?.topicGroupQuestions && topic?.topicGroupQuestions?.length>0" style="margin:20px; padding:5px;">
    <ul class="collapsible popout"  *ngIf="topic?.topicGroupQuestions" materialize="collapsible" 
      data-collapsible="expandable" style="padding: 5pt;">
      <li *ngFor="let cqi of topic?.topicGroupQuestions; let idx=index">
        <div class="collapsible-header green lighten-5">
          <div class="row"  style="margin-bottom: 0px;">
            <div class="col s10">QuestionItem [{{cqi?.questionItem?.name}}]</div>
          </div>
        </div>
        <div class="collapsible-body">
            <qddt-preview-questionitem [questionItem]="cqi.questionItem"></qddt-preview-questionitem>
        </div>
      </li>
    </ul>
  </div>
  <div class="row" *ngIf="topic.authors && topic.authors.length>0">
    <p><label class="active teal-text">Authors</label></p>
    <qddt-author-chip [authors]="topic.authors"></qddt-author-chip>
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
  providers: [ ],
})

export class PreviewTopicComponent {
  @Input() topic: any;
}
