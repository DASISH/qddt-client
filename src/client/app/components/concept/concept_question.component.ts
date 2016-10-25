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
        <qddt-questionitem-edit [isVisible]="true"
          (editQuestionItem)="onEditQuestionItem($event)"
          [editResponseDomain]="true"
          [questionitem]="questionItem">
        </qddt-questionitem-edit>

        <qddt-revision [isVisible]="revisionIsVisible"
          [qddtURI]="'audit/questionitem/' + questionItem.id + '/all'">
        </qddt-revision>
        <qddt-responsedomain-preview *ngIf="questionItem.responseDomain"
          [isVisible]="true" [responseDomain]="questionItem.responseDomain"
          #preview>
        </qddt-responsedomain-preview>
        <div class="row">
          <comment-list [ownerId]="questionItem.id"></comment-list>
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
    let i = this.concept.questionItems.findIndex((q: any) => q['id'] === questionitem['id']);
    if(i !== undefined) {
      this.concept.questionItems[i] = questionitem;
    }
  }
}
