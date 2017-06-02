import { Component, Input, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-publication-concept-preview',
  moduleId: module.id,
  template:
  `
  <ul *ngIf="concepts" materialize="collapsible" class="collapsible" data-collapsible="accordion" style="padding: 5pt;">
    <li *ngFor="let concept of concepts">
		  <div class="collapsible-header grey lighten-5">
        <div class="row">
          <div class="col s11">Concept: {{concept?.name}}</div>
          <div class="col s1">
            <label class="active">V{{concept?.version?.major}}.{{concept?.version?.minor}}
            </label>
          </div>
         </div>
      </div>
		  <div class="collapsible-body">
			  <p>{{concept?.description}}</p>
        <div *ngIf="concept.questionItems && concept.questionItems.length > 0" class="section">
          <ul class="collection with-header">
            <li class="collection-header">Question Items</li>
            <li class="collection-item" *ngFor="let questionItem of concept.questionItems">
              <div class="row"
                (mouseenter)="questionItem.showbutton = true"
                (mouseleave)="questionItem.showbutton = false">
                <div class="col s1">
                  <a class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
                    [ngClass]="{hide: !questionItem.showbutton}"
                    (click)="onClickQuestionItem(questionItem)">
                    <i class="material-icons" title="View QuestionItem">search</i>
                  </a>
                </div>
                <div class="col s11">{{questionItem?.question?.question}}</div>
              </div>
            </li>
          </ul>
          <div [attr.id]="concept.id + '-concept-questionitem-modal'"
            class="modal modal-fixed-footer"
            materialize="modal" [materializeActions]="questionItemActions">
            <div class="modal-footer">
              <button
              class="btn btn-default red modal-action modal-close waves-effect waves-red">
              <i class="close material-icons">close</i>
              </button>
            </div>
            <div class="modal-content">
              <qddt-concept-questionitem [questionItem]="questionItem"
                [editResponseDomain]="false"
                [concept]="concept">
              </qddt-concept-questionitem>
            </div>
          </div>
        </div>
        <div class="row">
          <qddt-revision-detail  [element]="concept" [type]="'concept'"></qddt-revision-detail>
        </div>
        <div class="row">
          <qddt-comment-list [ownerId]="concept.id" [comments]="concept.comments"></qddt-comment-list>
        </div>
        <div class="container" *ngIf="concept.children && concept.children.length > 0" style="width: 90%">
          <qddt-publication-concept-preview
            [concepts]="concept.children">
          </qddt-publication-concept-preview>
        </div>
      </div>
    </li>
  </ul>
  `,
  providers: [ ],
})

export class PublicationConceptPreviewComponent {
  @Input() concepts: any[];

  questionItemActions = new EventEmitter<string|MaterializeAction>();
  questionItem: any;

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit({action:'modal', params:['open']});
    // this.questionItemActions.emit({action:'modal', params:['open']});
  }

}
