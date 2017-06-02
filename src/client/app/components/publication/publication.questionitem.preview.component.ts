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
  template: `
  <div *ngIf="element">
    <div class="row">
      <div class="flow-text" style="padding-top: 15pt;padding-left: 15pt;">
      {{element.question?.question}}</div>
    </div>
    <div class="teal-text" *ngIf="element.question.intent" style="padding-left: 15pt; padding-bottom: 10pt">Intent</div>
    <div style="padding-left: 15pt;">{{element.question?.intent}}</div>
    <!--<div ngIf="element.question && element.question.intent" class="row">-->
      
    <!--</div>-->
    <div class="row">
      <qddt-responsedomain-preview *ngIf="element.responseDomain" 
        [isVisible]="true" [responseDomain]="element.responseDomain">
      </qddt-responsedomain-preview>
    </div>
    <div class="row">
      <qddt-revision-detail  [element]="element" [type]="'questionitem'"></qddt-revision-detail>
    </div>
    <div class="row">
      <ul class="collection with-header black-text">
        <li class="collection-item" *ngFor="let c of element.conceptRefs" >Concept: {{c?.name}}</li>
      </ul>
    </div>
  </div>`,
  providers: [ ],
})

export class PublicationQuestionitemPreviewComponent {
  @Input() element: any;

  // basedonActions = new EventEmitter<string|MaterializeAction>();
  //
  // onBasedonObjectDetail(id: string) {
  //   this.service.getConcept(id)
  //     .subscribe(
  //       (result: any) => {
  //         this.basedonObject = result;
  //         this.basedonActions.emit({action:'modal', params:['open']});
  //         // this.basedonActions.emit({action:'modal', params:['open']});
  //       },
  //       (err: any) => null
  //     );
  // }
}
