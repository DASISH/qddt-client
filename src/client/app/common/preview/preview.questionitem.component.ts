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
  selector: 'qddt-preview-questionitem',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  template: `
  <div *ngIf="questionItem" style="color: black">
    <div class="row">
      <div class="flow-text" style="padding-top: 15pt;padding-left: 15pt;">
      {{questionItem.question?.question}}</div>
    </div>
    <div class="teal-text" *ngIf="questionItem.question?.intent" style="padding-left: 15pt; padding-bottom: 10pt">Intent</div>
    <div style="padding-left: 15pt;">{{questionItem.question?.intent}}</div>
    <div class="row" style="padding-right: 5pt; padding-left:5pt ">
      <qddt-preview-responsedomain *ngIf="questionItem.responseDomain" 
        [isVisible]="true" [responseDomain]="questionItem.responseDomain">
      </qddt-preview-responsedomain>
    </div>
    <div class="row">
      <qddt-element-footer  [element]="questionItem" [type]="'questionitem'"></qddt-element-footer>
    </div>
    <div class="row">
      <ul class="collection with-header black-text">
        <li class="collection-item" *ngFor="let c of questionItem.conceptRefs" >Concept: {{c?.name}}</li>
      </ul>
    </div>
  </div>`,
  providers: [ ],
})

export class PreviewQuestionitemComponent {
  @Input() questionItem: any;

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
