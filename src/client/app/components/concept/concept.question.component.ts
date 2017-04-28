import { Component, Input } from '@angular/core';

import { ConceptService } from './concept.service';

@Component({
  selector: 'qddt-concept-questionitem',
  moduleId: module.id,
  providers: [ConceptService],
  template: `
  <div class="row" *ngIf="questionItem">
    <div class="row">
      <div class="col s10">
        <label class="active teal-text flow-text">Version: <!--
          -->{{questionItem?.version?.major}}.{{questionItem?.version?.minor}}
        </label>
      </div>
    </div>
    <div class="row">
      <div class="col s1 m1 l1">
        <br/>
        <div class="row">
          <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
            (click)="revisionIsVisible = !revisionIsVisible">
            <i class="material-icons left medium">history</i>
          </a>
        </div>
      </div>

      <div class="col s11 m11 l11">
        <div class="row teal-text">
          <h5>{{questionItem?.question?.question}}</h5>
        </div>
        <qddt-questionitem-edit [isVisible]="true"
          (editQuestionItem)="onEditQuestionItem($event)"
          [editResponseDomain]="true"
          [readonly]="true"
          [questionitem]="questionItem">
        </qddt-questionitem-edit>

        <qddt-revision [isVisible]="revisionIsVisible"
          [current]="questionItem" class="black-text"
          [qddtURI]="'audit/questionitem/' + questionItem.id + '/all'">
        </qddt-revision>
        <div class="row white grey-text text-darken-1">
          <qddt-comment-list [ownerId]="questionItem.id" [comments]="questionItem.comments"></qddt-comment-list>
        </div>
      </div>
    </div>
  </div>
`
})
export class ConceptQuestionComponent {

  @Input() concept: any;
  @Input() questionItem: any;
  private revisionIsVisible: boolean;

  constructor(private conceptService: ConceptService) {
    this.revisionIsVisible = false;
  }

  onEditQuestionItem(questionitem: any) {
    let i = this.concept.conceptQuestionItems.findIndex((q: any) => q['id'] !== undefined
      && q['id'] !== null && q['id']['questionItemId'] === questionitem['id']);
    if(i >= 0) {
      this.concept.conceptQuestionItems[i] = {'id': {questionItemId: questionitem.id, conceptId: this.concept.id}};
    }
  }
}
