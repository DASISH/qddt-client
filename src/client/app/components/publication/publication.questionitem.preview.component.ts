import { Component, Input } from '@angular/core';

enum DomainType {
  SCALE = 1,
  LIST,
  MIXED,
  DATETIME,
  NUMERIC,
  TEXT,
  MISSING,
}

@Component({
  selector: 'qddt-publication-questionitem-preview',
  moduleId: module.id,
  template:
  `
  <div *ngIf="element">
    <div class="row">
      <ul class="collection with-header black-text">
        <li class="collection-header">Question Item</li>
        <li  class="collection-item">Version: {{element?.version?.major}}.
          {{element?.version?.minor}}
        </li>
        <li class="collection-item">Name: {{element?.name}}</li>
        <li class="collection-item">Question Text: {{element?.question?.question}}</li>
        <li class="collection-item">Intent: {{element?.question?.intent}}</li>
      </ul>
    </div>
    <qddt-responsedomain-preview *ngIf="element.responseDomain"
      [isVisible]="true" [responseDomain]="element.responseDomain">
    </qddt-responsedomain-preview>
    <div class="row">
      <ul class="collection with-header black-text">
        <li class="collection-item" *ngFor="let c of element.conceptRefs" >Concept: {{c?.name}}</li>
      </ul>
    </div>
  </div>
  `,
  providers: [ ],
})

export class PublicationQuestionitemPreviewComponent {
  @Input() element: any;

}
