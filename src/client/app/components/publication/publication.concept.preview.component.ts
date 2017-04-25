import { Component, Input, EventEmitter } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes } from './publication.service';

@Component({
  selector: 'qddt-publication-concept-preview',
  moduleId: module.id,
  template:
  `
  <ul *ngIf="concepts" materialize="collapsible" class="collapsible" data-collapsible="accordion">
    <li *ngFor="let concept of concepts">
		  <div class="collapsible-header">
        <div class="row">
          <div class="col s11">Concept: {{concept?.name}}</div>
          <div class="col s1">
            <label class="active teal-text">V{{concept?.version?.major}}.{{concept?.version?.minor}}
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
                    <i class="material-icons">search</i>
                  </a>
                </div>
                <div class="col s11">{{questionItem?.question?.question}}</div>
              </div>
            </li>
          </ul>
          <div [attr.id]="concept.id + '-concept-questionitem-modal'"
            class="modal modal-fixed-footer"
            materialize [materializeActions]="questionItemActions">
            <div class="modal-footer">
              <button
              class="btn btn-default red modal-action modal-close waves-effect waves-red">
              <i class="close material-icons">close</i>
              </button>
            </div>
            <div class="modal-content">
              <qddt-concept-questionitem [questionItem]="questionItem" [concept]="concept">
              </qddt-concept-questionitem>
            </div>
          </div>
        </div>
        <div class="row">
        <p>
          <qddt-comment-list [ownerId]="concept.id" [comments]="concept.comments"></qddt-comment-list>
        </p>
        </div>
        <div class="container" *ngIf="concept.children && concept.children.length > 0">
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

  questionItemActions = new EventEmitter<string>();
  questionItem: any;

  onClickQuestionItem(questionItem) {
    console.log(questionItem);
    this.questionItem = questionItem;
    this.questionItemActions.emit('openModal');
  }

}
